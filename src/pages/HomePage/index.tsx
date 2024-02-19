import { Button } from 'antd';
import { Link } from 'react-router-dom';

export default function HomePage() {
  return (
    <div>
      <h2>Home Page</h2>
      <Link to="/login">
        <Button type="primary">Go to Login</Button>
      </Link>
    </div>
  );
}
