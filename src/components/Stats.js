export default function Stats({ rolls, title, time }) {
  return (
    <div>
      <h1 className='stats'>{`${title} Game`}</h1>
      <div className='stats--details'>
        <span>rolls: {rolls}</span>
        {/* <span>{title === 'Current' && time }</span> */}
      </div>
    </div>
  )
}