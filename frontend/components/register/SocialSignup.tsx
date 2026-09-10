
export default function SocialSignup() {
  return (
    <div className="grid grid-cols-2 gap-2 mb-6">

      <button
        type="button"
        className="flex items-center justify-center gap-2 py-2 px-3 rounded bg-[#f6f3ec] hover:bg-[#f0eee7] text-[#1c1c18] text-xs font-semibold transition-colors"
      >
        <span className="font-bold text-sm">G</span>
        Google
      </button>

      <button
        type="button"
        className="flex items-center justify-center gap-2 py-2 px-3 rounded bg-[#f6f3ec] hover:bg-[#f0eee7] text-[#1c1c18] text-xs font-semibold transition-colors"
      >
        <span className="text-sm">  Apple ID</span>
      </button>

    </div>
  );
}

