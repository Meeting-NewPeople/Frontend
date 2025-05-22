// components/BottomNav.tsx
export default function BottomNav() {
    return (
      <div className="fixed bottom-0 w-full bg-white flex justify-around py-2 border-t">
        {['home', 'chat', 'arrow', 'heart', 'profile'].map((icon, idx) => (
          <button key={idx}>
            <img src={`/icons/${icon}.svg`} alt={icon} className="w-6 h-6" />
          </button>
        ))}
      </div>
    );
  }
  