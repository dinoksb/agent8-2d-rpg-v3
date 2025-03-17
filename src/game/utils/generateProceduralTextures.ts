import Phaser from "phaser";

// Function to generate procedural textures for missing assets
export function generateProceduralTextures(scene: Phaser.Scene) {
  // Generate item glow texture
  if (!scene.textures.exists('item-glow')) {
    const canvas = scene.textures.createCanvas('item-glow', 64, 64);
    const ctx = canvas.getContext();
    
    // Create radial gradient
    const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 0.7)');
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
    
    // Fill with gradient
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 64, 64);
    
    canvas.refresh();
  }
  
  // Generate pickup effect texture
  if (!scene.textures.exists('pickup-effect')) {
    const canvas = scene.textures.createCanvas('pickup-effect', 64, 64);
    const ctx = canvas.getContext();
    
    // Create radial gradient
    const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
    gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.3)');
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
    
    // Fill with gradient
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 64, 64);
    
    // Add sparkles
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const x = 32 + Math.cos(angle) * 20;
      const y = 32 + Math.sin(angle) * 20;
      ctx.beginPath();
      ctx.arc(x, y, 2, 0, Math.PI * 2);
      ctx.fill();
    }
    
    canvas.refresh();
  }
  
  // Generate drop effect texture
  if (!scene.textures.exists('drop-effect')) {
    const canvas = scene.textures.createCanvas('drop-effect', 64, 64);
    const ctx = canvas.getContext();
    
    // Create radial gradient
    const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    gradient.addColorStop(0, 'rgba(255, 215, 0, 0.8)'); // Gold color
    gradient.addColorStop(0.5, 'rgba(255, 215, 0, 0.3)');
    gradient.addColorStop(1, 'rgba(255, 215, 0, 0)');
    
    // Fill with gradient
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 64, 64);
    
    // Add sparkles
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    for (let i = 0; i < 5; i++) {
      const angle = (i / 5) * Math.PI * 2;
      const x = 32 + Math.cos(angle) * 15;
      const y = 32 + Math.sin(angle) * 15;
      
      // Draw star
      drawStar(ctx, x, y, 5, 2, 5);
    }
    
    canvas.refresh();
  }
  
  // Generate hit effect texture
  if (!scene.textures.exists('hit-effect')) {
    const canvas = scene.textures.createCanvas('hit-effect', 64, 64);
    const ctx = canvas.getContext();
    
    // Create radial gradient
    const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    gradient.addColorStop(0, 'rgba(255, 0, 0, 0.8)'); // Red color
    gradient.addColorStop(0.5, 'rgba(255, 0, 0, 0.3)');
    gradient.addColorStop(1, 'rgba(255, 0, 0, 0)');
    
    // Fill with gradient
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 64, 64);
    
    // Add cross shape
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(22, 22);
    ctx.lineTo(42, 42);
    ctx.moveTo(42, 22);
    ctx.lineTo(22, 42);
    ctx.stroke();
    
    canvas.refresh();
  }
  
  // Generate attack effect texture
  if (!scene.textures.exists('attack-effect')) {
    const canvas = scene.textures.createCanvas('attack-effect', 64, 64);
    const ctx = canvas.getContext();
    
    // Create radial gradient
    const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    gradient.addColorStop(0, 'rgba(255, 165, 0, 0.8)'); // Orange color
    gradient.addColorStop(0.5, 'rgba(255, 165, 0, 0.3)');
    gradient.addColorStop(1, 'rgba(255, 165, 0, 0)');
    
    // Fill with gradient
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 64, 64);
    
    // Add slash shape
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(16, 48);
    ctx.lineTo(48, 16);
    ctx.stroke();
    
    // Add second slash
    ctx.beginPath();
    ctx.moveTo(20, 44);
    ctx.lineTo(44, 20);
    ctx.stroke();
    
    canvas.refresh();
  }
}

// Helper function to draw a star
function drawStar(ctx: CanvasRenderingContext2D, x: number, y: number, radius: number, innerRadius: number, spikes: number) {
  let rot = Math.PI / 2 * 3;
  let step = Math.PI / spikes;
  
  ctx.beginPath();
  ctx.moveTo(x, y - radius);
  
  for (let i = 0; i < spikes; i++) {
    ctx.lineTo(
      x + Math.cos(rot) * radius,
      y + Math.sin(rot) * radius
    );
    rot += step;
    
    ctx.lineTo(
      x + Math.cos(rot) * innerRadius,
      y + Math.sin(rot) * innerRadius
    );
    rot += step;
  }
  
  ctx.lineTo(x, y - radius);
  ctx.closePath();
  ctx.fill();
}
