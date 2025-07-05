import { useEffect, useState } from "react";
import axios from "axios";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://ecommerce-backend-291k.onrender.com/api/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
    } catch (err) {
      alert("❌ Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line
  }, []);

  // Optional: Delete user
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await axios.delete(`http://ecommerce-backend-291k.onrender.com/api/admin/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(users.filter((u) => u._id !== id));
      alert("User deleted!");
    } catch (err) {
      alert("❌ Failed to delete user");
    }
  };

  if (loading) return <div className="p-4">Loading users...</div>;

  return (
    <div className="p-2 sm:p-4 overflow-x-auto">
      <h1 className="text-lg sm:text-2xl font-bold mb-4">👥 Admin - Users</h1>
      <table className="min-w-[600px] w-full border border-gray-300 text-xs sm:text-base">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="py-2 px-2 sm:px-4 border">Name</th>
            <th className="py-2 px-2 sm:px-4 border">Email</th>
            <th className="py-2 px-2 sm:px-4 border">Role</th>
            <th className="py-2 px-2 sm:px-4 border">Registered</th>
            <th className="py-2 px-2 sm:px-4 border">Action</th>
          </tr>
        </thead>
        <tbody>
          {users.length === 0 ? (
            <tr>
              <td colSpan={5} className="text-center py-4 text-gray-500">
                No users found.
              </td>
            </tr>
          ) : (
            users.map((user) => (
              <tr key={user._id} className="border-t">
                <td className="p-2">{user.name}</td>
                <td className="p-2">{user.email}</td>
                <td className="p-2">
                  {user.isAdmin ? (
                    <span className="text-green-600 font-semibold">Admin</span>
                  ) : (
                    "User"
                  )}
                </td>
                <td className="p-2">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
                <td className="p-2">
                  {!user.isAdmin && (
                    <button
                      className="bg-red-500 text-white px-2 py-1 rounded text-xs sm:text-sm"
                      onClick={() => handleDelete(user._id)}
                    >
                      Delete
                    </button>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Users;