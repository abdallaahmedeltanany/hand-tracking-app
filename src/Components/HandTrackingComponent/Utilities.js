export const drawHand = (landmarks, ctx) => {
  const indexFingerTip = landmarks[8]; // Assuming index finger tip as a reference point

  if (indexFingerTip) {
    const [x, y] = indexFingerTip;

    if (!ctx.isDrawing) {
      ctx.isDrawing = true;
      ctx.beginPath();
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
      ctx.stroke();
    }
  } else {
    ctx.isDrawing = false;
  }
};