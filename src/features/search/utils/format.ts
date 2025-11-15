export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
};

export const formatPrice = (amount: number, currency: string): string => {
  const formattedAmount = amount.toLocaleString("uk-UA");
  const currencySymbol = currency === "usd" ? "грн" : currency.toUpperCase();
  return `${formattedAmount} ${currencySymbol}`;
};
