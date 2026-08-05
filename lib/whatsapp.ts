import { Product, CustomCakeOrder, StoreSettings } from "./types";

export function formatProductWhatsAppUrl(
  product: Product,
  settings: StoreSettings,
  options?: {
    weight?: string;
    flavor?: string;
    isEggless?: boolean;
    customMessage?: string;
    deliveryDate?: string;
  }
): string {
  const selectedWeight = options?.weight || (product.sizes.length > 0 ? product.sizes[0] : "1 Kg");
  const selectedFlavor = options?.flavor || (product.flavors.length > 0 ? product.flavors[0] : "Standard");
  const egglessText = options?.isEggless !== undefined ? (options.isEggless ? "Yes (Eggless 🌿)" : "No (With Egg 🥚)") : (product.isEggless ? "Yes (Eggless 🌿)" : "Standard");

  let message = `Hello *${settings.storeName}*! 👋\n\n`;
  message += `I would like to order the following cake from your website:\n\n`;
  message += `🎂 *Cake Name:* ${product.name}\n`;
  message += `📁 *Category:* ${product.category}\n`;
  message += `⚖️ *Weight / Size:* ${selectedWeight}\n`;
  message += `🍓 *Flavor:* ${selectedFlavor}\n`;
  message += `🌿 *Eggless:* ${egglessText}\n`;
  
  if (options?.customMessage) {
    message += `✍️ *Custom Name/Message on Cake:* "${options.customMessage}"\n`;
  }
  
  if (options?.deliveryDate) {
    message += `📅 *Preferred Delivery Date:* ${options.deliveryDate}\n`;
  }

  message += `\n💰 *Price:* ${settings.currency}${product.price}\n`;
  message += `\nPlease let me know availability and payment details to confirm the order. Thank you! ✨`;

  const encodedMessage = encodeURIComponent(message);
  const cleanPhone = settings.whatsappNumber.replace(/[^0-9]/g, "");

  return `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
}

export function formatCustomCakeWhatsAppUrl(
  order: CustomCakeOrder,
  settings: StoreSettings
): string {
  let message = `Hello *${settings.storeName}*! 👋\n\n`;
  message += `I want to place a *Bespoke Custom Cake Order*:\n\n`;
  if (order.productName) {
    message += `🎂 *Based On:* ${order.productName}\n`;
  }
  message += `⚖️ *Weight:* ${order.weight}\n`;
  message += `🍓 *Selected Flavor:* ${order.flavor}\n`;
  message += `🌿 *Eggless:* ${order.isEggless ? "Yes (Eggless 🌿)" : "No (With Egg 🥚)"}\n`;

  if (order.customMessage) {
    message += `✍️ *Message Written on Cake:* "${order.customMessage}"\n`;
  }

  if (order.deliveryDate) {
    message += `📅 *Delivery Date:* ${order.deliveryDate}\n`;
  }

  if (order.deliveryTimeSlot) {
    message += `⏰ *Time Slot:* ${order.deliveryTimeSlot}\n`;
  }

  if (order.notes) {
    message += `📝 *Special Notes:* ${order.notes}\n`;
  }

  message += `\n💰 *Estimated Total:* ${settings.currency}${order.calculatedPrice}\n`;
  message += `\nPlease confirm if this custom cake can be prepared. Thanks! ✨`;

  const encodedMessage = encodeURIComponent(message);
  const cleanPhone = settings.whatsappNumber.replace(/[^0-9]/g, "");

  return `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
}
