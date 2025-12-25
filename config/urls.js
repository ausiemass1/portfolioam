const WEB_URL = process.env.WEB_URL;

if (!WEB_URL) {
  throw new Error("WEB_URL is not defined");
}

export const urls = {
  web: WEB_URL,

  googleCallback: `${WEB_URL}/auth/google/callback`,
  githubCallback: `${WEB_URL}/auth/github/callback`,

  paypal: {
    success: `${WEB_URL}/paypal/success`,
    cancel: `${WEB_URL}/paypal/cancel`,
  },

  stripe: {
    success: `${WEB_URL}/stripe/success`,
    cancel: `${WEB_URL}/stripe/cancel`,
  },
};
