/// <reference types="vite/client" />

declare module "swiper/css" {}
declare module "swiper/css/navigation" {}

interface Window {
  BookingToolIframe?: {
    initialize: (config: { url: string; baseUrl: string; target: string }) => void;
  };
}
