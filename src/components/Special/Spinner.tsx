export default function Spinner({ progress }: { progress: number }) {
  return <span>Loading CO₂ data... ({progress}%)</span>;
}
