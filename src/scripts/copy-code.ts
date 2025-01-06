document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".copy-button").forEach((button) => {
    button.addEventListener("click", async () => {
      const pre = button.parentElement;
      if (!pre) return;

      const code = pre.querySelector("code");
      if (!code) return;

      try {
        await navigator.clipboard.writeText(code.textContent || "");
        const originalText = button.textContent;
        button.textContent = "已复制！";
        setTimeout(() => {
          button.textContent = originalText;
        }, 2000);
      } catch (err) {
        console.error("Failed to copy:", err);
        button.textContent = "复制失败";
      }
    });
  });
});
