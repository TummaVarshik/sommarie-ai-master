"use client";
import { z } from "zod";
import UploadFormInput from "@/components/upload/upload-form-input";
import { useUploadThing } from "@/utils/uploadthing";
import { toast } from "sonner";
import {
  generatePdfSummary,
  generatePdfText,
  storePdfSummaryAction,
} from "@/actions/upload-actions";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import LoadingSkeleton from "./loading-skeleton";
import { formatFileNameAsTitle } from "@/utils/format-utils";

const schema = z.object({
  file: z
    .instanceof(File, { message: "Invalid file" })
    .refine(
      (file) => file.size <= 20 * 1024 * 1024,
      "File size must be less than 20MB"
    )
    .refine(
      (file) => file.type.startsWith("application/pdf"),
      "File must be a PDF"
    ),
});
export default function UploadForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { startUpload, routeConfig } = useUploadThing("pdfUploader", {
    onClientUploadComplete: () => {
      console.log("uploaded successfully!");
    },
    onUploadError: (err) => {
      console.error("error occurred while uploading", err);
      toast.error("Error occured while uploading", {
        description: err.message,
      });
    },
    onUploadBegin: (data) => {
      console.log("upload has begun for", data);
    },
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const formData = new FormData(e.currentTarget);
      const file = formData.get("file") as File;

      //validating the fields.
      const validatedFields = schema.safeParse({ file });
      console.log(validatedFields);
      if (!validatedFields.success) {
        toast.error("Something went wrong", {
          description:
            validatedFields.error.flatten().fieldErrors.file?.[0] ??
            "Invalid file",
        });
        setIsLoading(false);
        return;
      }

      toast.success("📑 Uploading PDF...", {
        description: "We are uploading your PDF!",
      });

      //upload the file to upolading.

      const uploadResponse = await startUpload([file]);
      if (!uploadResponse) {
        toast.error("Something  went wrong", {
          description: "Please use a different file",
        });
        setIsLoading(false);
        return;
      }

      toast.success("📑 Processing PDF", {
        description: "Hang tight, Our AI is reading through your document! ✨",
      });

      const uploadFileUrl = uploadResponse[0].serverData.fileUrl;

      //parse the pdf using lang chain.

      let storeResult: any;
      

      const formatedFileNameAsTitle = formatFileNameAsTitle(file.name);

      const result = await generatePdfText({
        fileUrl: uploadFileUrl,
      });

      toast.success("📑 Generating PDF Summary", {
        description: "Hang tight, Our AI is reading through your document! ✨",
      });
      // call ai service

      const summaryResult = await generatePdfSummary({
        pdfText:result?.data?.pdfText ?? '',
        fileName: formatedFileNameAsTitle,
      });
 
      toast.success("📑 Saving PDF Summary", {
        description: "Hang tight, We are saving your summary! ✨",
      });

      const { data = null, message = null } = summaryResult || {};
      if (data?.summary) {
        //save the summary to the Database.
        storeResult = await storePdfSummaryAction({
          summary: data.summary,
          fileUrl: uploadResponse[0].serverData.fileUrl,
          title: formatedFileNameAsTitle,
          fileName: file.name,
        });
      }
      toast.success("✨ Summary Generated!", {
        description: "Your PDF has been successfully summarized and saved! ✨",
      });
      formRef.current?.reset();
      //resirect to the [id] summary page.
      router.push(`/summaries/${storeResult.data.id}`);
    } catch (error) {
      setIsLoading(false);
      console.error("Error occurred", error);
      formRef.current?.reset();
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="flex flex-col gap-8 w-full max-w-2xl mx-auto">
      <div className="relative">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full border-t border-gray-200 dark:border-gray-800" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-background px-3 text-muted-foreground text-sm">
            Upload PDF
          </span>
        </div>
      </div>
      <UploadFormInput
        isLoading={isLoading}
        onSubmit={handleSubmit}
        ref={formRef}
      />
      {isLoading && (
        <>
          <div className="relative">
            <div
              className="absolute inset-0 flex items-center"
              aria-hidden="true"
            >
              <div className="w-full border-t border-gray-200 dark:border-gray-800" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-background px-3 text-muted-foreground text-sm">
                Processing
              </span>
            </div>
          </div>
          <LoadingSkeleton />
        </>
      )}
    </div>
  );
}
