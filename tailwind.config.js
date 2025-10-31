/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dashboard: {
          loadingText: 'var(--dashboard-loading-text-color)',
          bg: 'var(--dashboard-bg-color)',
          text: 'var(--dashboard-text-color)',
          sidebarBg: 'var(--dashboard-sidebar-bg-color)',
          sidebarBorder: 'var(--dashboard-sidebar-border-color)',
          titlesectionBorder: 'var(--dashboard-titlesection-border-color)',
          titlesectionButton: 'var(--dashboard-titlesection-button-color)',
          titlesectionButtonHover: 'var(--dashboard-titlesection-button-color-hover)',
          searchinputBg: 'var(--dashboard-search-input-bg-color)',
          searchinputPlaceholder: 'var(--dashboard-search-placeholder-color)',
          searchinputFocus: 'var(--dashboard-search-focus-bg-color)',
          userBg: 'var(--dasboard-users-bg-color)',
          userbgHover: 'var(--dashboard-users-bg-color-hover)',
          userTagline: 'var(--dashboard-user-tagline-text-color)',
          selecteduserBg: 'var(--dashboard-selected-user-bg-color)',
          selecteduserBorder: 'var(--dashboard-selected-user-border-color)',
          senderBg: 'var(--dashboard-sender-bg-color)',
          reciverBg: 'var(--dashboard-reciver-bg-color)',
          msgBorder: 'var(--dashboard-msg-input-border-color)',
          msgBg: 'var(--dashboard-msg-bg-color)',

          msgPlaceholder: 'var(--dashboard-msg-placeholder-color)',
          msgFocus: 'var(--dashboard-msg-focus-color)',
          sendbuttonBg: 'var(--dashboard-send-button-bg-color)',
          sendbuttonText: 'var(--dashboard-send-button-text-color)',
          sendbuttonbgHover: 'var(--dashboard-send-button-bg-hover)',
          welcomeText: 'var(--dashboard-welcome-text-color)',
          welcomeHeading: 'var(--dashboard-welcome-heading-text-color)',
          welcomeBody: 'var( --dashboard-welcome-body-text-color)',
        },

        login: {
          bg: 'var(--login-bg-color)',
          text: 'var(--login-text-color)',
          formBg: 'var(--login-form-bg-color)',
          formBorder: 'var(--login-form-border-color)',
          errorText: 'var(--login-error-text-color)',
          errorBg: 'var(--login-error-bg-color)',
          errorbuttonText: 'var(--login-error-button-text-color)',
          errorbuttontextHover: 'var(--login-error-button-text-color-hover)',
          labelText: 'var(--login-label-text-color)',
          inputbg: 'var(--login-input-bg-color)',
          inputFocus: 'var(--login-input-focus-color)',
          inputText: 'var(--login-input-text-color)',
          inputPlaceholder: 'var(--login-input-placeholder-color)',
          buttondisabledBg: 'var(--login-button-bg-color-disabled)',
          buttondisabledText: 'var(--login-button-text-color-disabled)',
          buttonBg: 'var(--login-button-bg-color)',
          buttonbgHover: 'var(--login-button-bg-hover)',
          buttonText: 'var(--login-button-text-color)',
          bodyText: 'var(--login-body-text-color)',
          bodytextLink: 'var(--login-body-link-text-color)'

        },

        signup: {
          bg: 'var(--signup-bg-color)',
          text: 'var(--signup-text-color)',
          errorbg: 'var(--signup-error-bg-color)',
          errorText: 'var(--signup-error-text-color)',
          errorbuttonText: 'var(--signup-error-button-text-color)',
          errorbuttontextHover: 'var(--signup-error-button-text-color-hover)',
          formBg: 'var(--signup-form-bg-color)',
          formBorder: 'var(--signup-form-border-color)',
          labelText: 'var(--signup-label-text-color)',
          inputBg: 'var(--signup-input-bg-color)',
          inputFocus: 'var(--signup-input-focus-color)',
          inputText: 'var(--signup-input-text-color)',
          inputPlaceholder: 'var(--signup-input-placeholder-color)',
          inputerrorText: 'var(--signup-input-error-text-color)',
          buttondisabledBg: 'var(--signup-button-bg-color-disabled)',
          buttondisabledText: 'var(--signup-button-text-color-disabled)',
          buttonBg: 'var(--signup-button-bg-color)',
          buttonbgHover: 'var(--signup-button-bg-hover)',
          buttonText: 'var(--signup-button-text-color)',
          bodyText: 'var(--signup-body-text-color)',
          bodyLink: 'var(--signup-body-link-text-color)',

        }
      }
    },
  },
  plugins: [],
}
