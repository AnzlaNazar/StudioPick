interface GitHubProfile {
  public_repos: number;
  created_at: string;
}

export default async function HealthPage() {
  let profile: GitHubProfile | null = null;
  let status = "Success";

  try {
    const res = await fetch("https://api.github.com/users/AnzlaNazar", {
      cache: "no-store",
    });
    if (!res.ok) throw new Error("API call failed");
    profile = await res.json();
  } catch {
    status = "Failed to connect to GitHub API";
  }

  return (
    <main className="max-w-md mx-auto my-12 p-6 border rounded-lg shadow-sm font-mono text-sm space-y-3 bg-white">
      <h1 className="font-bold text-base border-b pb-2">System Health Diagnostic</h1>
      <p>
        API Status:{" "}
        <span className={profile ? "text-emerald-600 font-semibold" : "text-rose-600 font-semibold"}>
          {status}
        </span>
      </p>
      {profile ? (
        <>
          <p>Public Repositories: {profile.public_repos}</p>
          <p>Account Created: {profile.created_at.slice(0, 10)}</p>
        </>
      ) : (
        <p className="text-rose-500 text-xs">Diagnostic failed. GitHub endpoint unreachable.</p>
      )}
    </main>
  );
}