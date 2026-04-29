// This is the single, shared audio instance for the whole app
export const notificationAudio = new Audio("/Alert_ringtone.mp3");

// Pre-configure it
notificationAudio.loop = true;
notificationAudio.preload = "auto";
notificationAudio.volume = 1; // ensure audible

// A helper function to "unlock" it
export const unlockAudio = async () => {
  try {
    await notificationAudio.play();
    notificationAudio.pause();
    notificationAudio.currentTime = 0;
    console.log("✅ Audio Unlocked Successfully");
    return true;
  } catch (error) {
    console.error("❌ Audio Unlock Failed:", error);
    return false;
  }
};
