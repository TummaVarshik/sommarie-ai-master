/*import { isDev } from "./helpers";

export const PricingPlans = [
    {
      name: "Basic",
      price: 9,
      description: "Perfect for occational use",
      items: [
        "5 PDF summaries per month",
        "Standard processing speed",
        "Email support"
      ],
      id: "basic",
      paymentLink: isDev?'https://buy.stripe.com/test_3cI14pfgBecHaPv3oienS05':'https://buy.stripe.com/test_dRm5kFfgBc4zcXD5wqenS00',
      priceId: 'price_1RjPuwPwUxEUwG1O9RPb5Hd0'
    },
    {
      name: "Pro",
      price: 19,
      description: "For proffesionals and teams",
      items: [
        "Unlimited PDF summaries",
        "Priority processing",
        "24/7 priority support",
        "Mardown Export"
      ],
      id: "pro",
      paymentLink: isDev?'https://buy.stripe.com/test_6oU6oJ9Wh4C7cXD4smenS04':'https://buy.stripe.com/test_00g3f90k75101Dq001',
      priceId: 'price_1RjPvEPwUxEUwG1ONMI1TuR3'
    }
  ];

*/
export const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delay: 0.1,
    },
  },
};


export const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    transition: {
      type: "spring",
      damping: 15,
      stiffness: 50,
      duration: 0.8,
    }
  },
};
