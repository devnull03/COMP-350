//package chapter13;

public class TestGeometricObject {
  /** Main method */
  public static void main(String[] args) {
    // Declare and initialize two geometric objects
	//GeometricObject geoObject0 = new GeometricObject(); //ERROR!
	GeometricObject geoObject0 = new Circle();
    GeometricObject geoObject1 = new Circle(5);
    GeometricObject geoObject2 = new Rectangle(5, 3);
    
    
    System.out.println(geoObject0.getColor());
    geoObject1.setColor("red");
    System.out.println(geoObject1.getColor());

    System.out.println("The two objects have the same area? " +
      equalArea(geoObject1, geoObject2));

    displayGeometricObject(geoObject0);
    // Display circle
    displayGeometricObject(geoObject1);

    // Display rectangle
    displayGeometricObject(geoObject2);
  }

  /** A method for comparing the areas of two geometric objects */
  public static boolean equalArea(GeometricObject object1,
      GeometricObject object2) {
    return object1.getArea() == object2.getArea();
  }

  /** A method for displaying a geometric object */
  public static void displayGeometricObject(GeometricObject object) {
    System.out.println();
    System.out.println("The area is " + object.getArea());
    System.out.println("The perimeter is " + object.getPerimeter());
  }
}
