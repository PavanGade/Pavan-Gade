import { Linking } from 'react-native';

/** Deep-link helpers only — no unauthorized messaging automation. */
export async function openPhone(phone: string): Promise<void> {
  const url = `tel:${phone.replace(/\s+/g, '')}`;
  await Linking.openURL(url);
}

export async function openEmail(email: string, subject?: string): Promise<void> {
  const query = subject ? `?subject=${encodeURIComponent(subject)}` : '';
  await Linking.openURL(`mailto:${email}${query}`);
}

export async function openWhatsApp(phone: string, text?: string): Promise<void> {
  const digits = phone.replace(/[^\d]/g, '');
  const query = text ? `?text=${encodeURIComponent(text)}` : '';
  await Linking.openURL(`https://wa.me/${digits}${query}`);
}
