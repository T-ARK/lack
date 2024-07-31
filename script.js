let highestZ = 1;

class Paper {
  holdingPaper = false;
  currentTouch = { x: 0, y: 0 };
  prevTouch = { x: 0, y: 0 };
  currentPaperPosition = { x: 0, y: 0 };
  rotation = Math.random() * 30 - 15;
  rotating = false;

  init(paper) {
    // Common event handler for updating paper position
    const updatePaperPosition = (clientX, clientY) => {
      const velX = clientX - this.prevTouch.x;
      const velY = clientY - this.prevTouch.y;

      if (this.holdingPaper && !this.rotating) {
        this.currentPaperPosition.x += velX;
        this.currentPaperPosition.y += velY;

        paper.style.transform = `translateX(${this.currentPaperPosition.x}px) translateY(${this.currentPaperPosition.y}px) rotateZ(${this.rotation}deg)`;
      }

      this.prevTouch.x = clientX;
      this.prevTouch.y = clientY;
    };

    const handleMouseMove = (e) => {
      updatePaperPosition(e.clientX, e.clientY);
      if (this.rotating) {
        this.updateRotation(e.clientX, e.clientY);
      }
    };

    const handleTouchMove = (e) => {
      e.preventDefault();
      const touch = e.touches[0];
      updatePaperPosition(touch.clientX, touch.clientY);
      if (this.rotating) {
        this.updateRotation(touch.clientX, touch.clientY);
      }
    };

    const handleMouseDown = (e) => {
      this.startHolding(paper, e.clientX, e.clientY, e.button);
    };

    const handleTouchStart = (e) => {
      const touch = e.touches[0];
      this.startHolding(paper, touch.clientX, touch.clientY, null);
    };

    paper.addEventListener('mousemove', handleMouseMove);
    paper.addEventListener('mousedown', handleMouseDown);
    paper.addEventListener('touchmove', handleTouchMove);
    paper.addEventListener('touchstart', handleTouchStart);
    
    // End events
    window.addEventListener('mouseup', () => {
      this.releasePaper();
    });
    window.addEventListener('touchend', () => {
      this.releasePaper();
    });

    // Rotation
    paper.addEventListener('gesturestart', (e) => {
      e.preventDefault();
      this.rotating = true;
    });
    paper.addEventListener('gestureend', () => {
      this.rotating = false;
    });
  }

  startHolding(paper, clientX, clientY, button) {
    if (this.holdingPaper) return;
    this.holdingPaper = true;
    paper.style.zIndex = highestZ++;
    this.currentTouch.x = clientX;
    this.currentTouch.y = clientY;
    this.prevTouch.x = clientX;
    this.prevTouch.y = clientY;

    // Right-click for rotation
    if (button === 2) {
      this.rotating = true;
    }
  }

  releasePaper() {
    this.holdingPaper = false;
    this.rotating = false;
  }

  updateRotation(clientX, clientY) {
    const dirX = clientX - this.currentTouch.x;
    const dirY = clientY - this.currentTouch.y;

    const angle = Math.atan2(dirY, dirX);
    let degrees = (360 + Math.round(degrees * (180 / Math.PI))) % 360;
    
    this.rotation = degrees;
  }
}

const papers = Array.from(document.querySelectorAll('.paper'));
papers.forEach(paper => {
  const p = new Paper();
  p.init(paper);
});
