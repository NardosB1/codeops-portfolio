// Stretch goal: the whole mechanism behind @UseGuards, minus Nest.
// Run:  npx nest build && node dist/role-demo.js
import "reflect-metadata";

const ROLE_KEY = "role";

// A decorator is just a function that runs once, when the class is defined.
// This one only STORES a value; nothing is enforced here.
export function Role(role: string) {
  return (target: object, propertyKey: string | symbol): void => {
    Reflect.defineMetadata(ROLE_KEY, role, target, propertyKey);
  };
}

class DemoController {
  @Role("admin")
  deleteOrder(): string {
    return "order deleted";
  }

  listOrders(): string {
    return "orders listed";
  }
}

// Read the metadata back, exactly as a guard will on Day 62.
console.log(Reflect.getMetadata(ROLE_KEY, DemoController.prototype, "deleteOrder")); // admin
console.log(Reflect.getMetadata(ROLE_KEY, DemoController.prototype, "listOrders")); // undefined

// A guard is: read the required role, compare it with the caller's role.
function canCall(method: string, callerRole: string): boolean {
  const required: string | undefined = Reflect.getMetadata(ROLE_KEY, DemoController.prototype, method);
  return required === undefined || required === callerRole;
}

console.log("customer -> deleteOrder:", canCall("deleteOrder", "customer")); // false
console.log("admin    -> deleteOrder:", canCall("deleteOrder", "admin")); // true
console.log("customer -> listOrders: ", canCall("listOrders", "customer")); // true