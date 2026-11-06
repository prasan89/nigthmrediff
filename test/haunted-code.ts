// Intentionally haunted code for NightmareDiff demo

const password = "super_secret_123";
const api_key = "sk-abc123xyz456";

function getUser(id: number) {
  const user = fetchUser(id);
  console.log("fetched user", user);
  return user.address.city; // null dereference waiting to happen
}

function fetchUser(id: number) {
  // TODO: add caching here
  return null as any;
}

async function riskyOperation() {
  try {
    await doSomethingDangerous();
  } catch (e) {}
}

function doSomethingDangerous() {
  return eval("process.env");
}

function renderUserName(name: string) {
  const el = document.getElementById("username")!;
  el.innerHTML = name; // XSS vector
}

function findAll(db: any) {
  return db.query("SELECT * FROM users"); // SELECT *
}
