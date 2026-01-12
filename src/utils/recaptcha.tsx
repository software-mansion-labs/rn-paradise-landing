import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";

export interface CaptchaProps {
  siteKey: string;
}

export interface CaptchaRef {
  reset: () => void;
  getValue: () => string;
  execute: (action: string) => Promise<string>;
  isReady: () => boolean;
}

export const Captcha = forwardRef<CaptchaRef, CaptchaProps>(
  ({ siteKey }, ref) => {
    const tokenRef = useRef("");
    const isReadyRef = useRef(false);

    useImperativeHandle(
      ref,
      () => ({
        reset: () => {
          tokenRef.current = "";
        },
        getValue: () => {
          return tokenRef.current;
        },
        isReady: () => {
          if (!window.grecaptcha || !window.grecaptcha.enterprise) {
            return false;
          }

          const hasEnterpriseExecute =
            typeof window.grecaptcha.enterprise.execute === "function";

          if (hasEnterpriseExecute && !isReadyRef.current) {
            isReadyRef.current = true;
          }

          return hasEnterpriseExecute;
        },
        execute: async (_action: string) => {
          if (
            !window.grecaptcha ||
            !window.grecaptcha.enterprise ||
            typeof window.grecaptcha.enterprise.execute !== "function"
          ) {
            return "";
          }

          try {
            const token = await window.grecaptcha.enterprise.execute(siteKey, {
              action: _action,
            });
            tokenRef.current = token;
            return token;
          } catch (error) {
            console.error("[Captcha] Execution failed", error);
            return "";
          }
        },
      }),
      [siteKey],
    );

    useEffect(() => {
      if (!siteKey || siteKey.trim() === "") {
        return;
      }

      const waitForRecaptcha = () => {
        if (window.grecaptcha && window.grecaptcha.enterprise) {
          const hasEnterpriseExecute =
            typeof window.grecaptcha.enterprise.execute === "function";

          if (hasEnterpriseExecute) {
            isReadyRef.current = true;

            if (typeof window.grecaptcha.enterprise.ready === "function") {
              try {
                window.grecaptcha.enterprise.ready(() => {
                  isReadyRef.current = true;
                });
              } catch (e) {}
            }
          } else if (typeof window.grecaptcha.enterprise.ready === "function") {
            try {
              window.grecaptcha.enterprise.ready(() => {
                isReadyRef.current = true;
              });
            } catch (e) {
              setTimeout(waitForRecaptcha, 100);
            }
          } else {
            setTimeout(waitForRecaptcha, 100);
          }
        } else {
          setTimeout(waitForRecaptcha, 100);
        }
      };

      const scriptId = "grecaptcha-script";
      const existingScript = document.getElementById(scriptId);

      if (!existingScript) {
        const script = document.createElement("script");
        script.id = scriptId;
        script.async = true;
        script.defer = true;
        script.src = `https://www.google.com/recaptcha/enterprise.js?render=${siteKey}`;

        script.onload = () => {
          waitForRecaptcha();
        };

        script.onerror = () => {
          console.error("[Captcha] Failed to load reCAPTCHA script");
        };

        document.body.appendChild(script);
      } else {
        waitForRecaptcha();
      }

      return () => {
        tokenRef.current = "";
      };
    }, [siteKey]);

    return null;
  },
);

Captcha.displayName = "Captcha";
