export default function CampusMap() {
  return (
    <div className="card-surface overflow-hidden">
      <div className="p-4 pb-2">
        <h2 className="text-xl">Campus Map</h2>
        <p className="text-xs text-ethereal-500 dark:text-ethereal-400">
          Reference the map to find the exact building or area when submitting a report.
        </p>
      </div>
      <div className="aspect-[4/3] w-full">
        <iframe
          title="ITS Campus Map"
          src="https://www.google.com/maps/d/u/0/embed?mid=1hzbeC5PRvlp8q3fMpc-t-Voq-4n4t5A&ehbc=2E312F"
          className="w-full h-full border-0"
          loading="lazy"
        />
      </div>
    </div>
  )
}
