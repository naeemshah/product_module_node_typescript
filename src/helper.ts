export const clientUrl = 'https://testing.egenienext.com/bedayeah';
console.log('this is process.env.AUTH_URL', process.env.AUTH_URL);
export const authUrl =
  process.env.AUTH_URL || 'http://testing.egenienext.com:3003';
export const vendorUrl =
  process.env.VENDOR_URL || 'http://testing.egenienext.com:3006';
export const notificationUrl =
  process.env.NOTIFCATION_URL || 'http://testing.egenienext.com:3010';
// process.env.NOTIFCATION_URL || 'http://notifications:3010';
