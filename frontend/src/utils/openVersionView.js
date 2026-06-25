let versionViewWindow = null;

export function openVersionView(data) {
  if (versionViewWindow && !versionViewWindow.closed) {
    versionViewWindow.close();
  }

  localStorage.setItem("selectedVersion", JSON.stringify(data));

  const w = Math.round(window.screen.availWidth * 0.25);
  const h = window.screen.availHeight;
  const left = window.screen.availWidth - w;

  versionViewWindow = window.open(
    "/version-view",
    "_blank",
    `width=${w},height=${h},left=${left},top=0,resizable=yes,scrollbars=yes`
  );
}
