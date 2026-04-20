import { useState } from "react";

export default function DeployN8NDialog({
  onDeploy,
}: {
  onDeploy: (name: string) => void;
}) {
  const [name, setName] = useState("");

  return (
    <div className="p-4 border rounded">
      <h2>Deploy n8n</h2>

      <input
        placeholder="Service name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="border p-2"
      />

      <button
        onClick={() => onDeploy(name)}
        className="bg-blue-500 text-white px-4 py-2 ml-2"
      >
        Deploy
      </button>
    </div>
  );
}