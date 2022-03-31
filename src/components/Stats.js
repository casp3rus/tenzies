export default function Stats({ rolls, title, time }) {
  return (
    <div>
      <h1 className="stats">{`${title} Game ${title === 'Best' ? 'Ever' : ''}`}</h1>
      <div className="stats--details">
        <span>ROLLS:{rolls}</span>
        <span>{title === 'Current' ? `${time}s` : `TIME:${time}s`}</span>
      </div>
    </div>
  );
}
