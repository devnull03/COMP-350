class ModelUtils {
  /**
   * Prepares a model for proper solid surface rendering
   * @param {p5.Geometry} model - The loaded 3D model
   * @param {p5.Color} materialColor - The color to apply to the model
   * @returns {p5.Geometry} The processed model
   */
  static prepareModel(model, materialColor = color(200, 200, 200)) {
    if (!model) return null;
    
    // Store the material settings with the model
    model.materialColor = materialColor;
    
    return model;
  }
  
  /**
   * Apply proper material settings before rendering a model
   * @param {p5.Graphics} graphics - The p5 renderer
   * @param {p5.Color} materialColor - The color to apply
   */
  static applyMaterial(materialColor = color(200, 200, 200)) {
    push();
    // Make sure we don't show the wireframe
    noStroke();
    
    // Apply solid material with subtle lighting properties
    fill(materialColor);
    specularMaterial(materialColor);
    shininess(5);
    
    // Ambient material helps ensure the model is visible from all angles
    ambientMaterial(red(materialColor), green(materialColor), blue(materialColor));
    pop();
  }
  
  /**
   * Displays a model with proper material settings
   * @param {p5.Geometry} model - The model to render
   * @param {Boolean} useModelMaterial - Whether to use the model's stored material color
   */
  static displayModel(model, useModelMaterial = true) {
    if (!model) return;
    
    push();
    // Apply either the model's material or default material
    if (useModelMaterial && model.materialColor) {
      this.applyMaterial(model.materialColor);
    } else {
      this.applyMaterial();
    }
    
    model(model);
    pop();
  }
}
