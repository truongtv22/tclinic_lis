import { Button } from "antd";
import { Link } from "react-router-dom";

export default function LoginPage() {
  return (
    <div>
      <h2>Login Page</h2>
      <Link to="/">
        <Button type="primary">Go to Home</Button>
      </Link>
    </div>
  );
}
