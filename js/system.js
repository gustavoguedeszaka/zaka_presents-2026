// ZAKA 2026 - Core System Initialization

document.addEventListener('DOMContentLoaded', () => {
  console.log('ZAKA Foundation: System Initialized.');
  
  // Initialize subsystems
  if (window.ZakaNavigation) window.ZakaNavigation.init();
  if (window.ZakaMotion) window.ZakaMotion.init();
});
