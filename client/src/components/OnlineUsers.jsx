// ✅ Separate component — reusable, clean, single responsibility
export default function OnlineUsers({ users }) {
    return (
        <div className="w-52 bg-gray-800 flex flex-col shrink-0">
            <div className="p-4 border-b border-gray-700">
                <h2 className="text-white font-semibold text-sm uppercase tracking-wider">
                    Online — {users.length}
                </h2>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-2">
                {users.length === 0 ? (
                    <p className="text-gray-500 text-xs">No one online</p>
                ) : (
                    users.map((user, i) => (
                        <div key={i} className="flex items-center gap-2">
                            {/* Green dot */}
                            <span className="w-2 h-2 rounded-full bg-green-400 shrink-0" />
                            <span className="text-gray-300 text-sm truncate">
                                {user}
                            </span>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
