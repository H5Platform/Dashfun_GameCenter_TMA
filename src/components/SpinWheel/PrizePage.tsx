export default function PrizePage({ prize }) {
  return (
    <div className="mx-auto">
      <img src="/img/dashfun-point-icon.png" alt="prize" />
      <p className="text-center text-xl my-3">You won {prize}!</p>
    </div>
  );
}
