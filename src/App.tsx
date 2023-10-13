import dayjs from 'dayjs'
import objectSupport from 'dayjs/plugin/objectSupport'
import { useState } from 'react'
dayjs.extend(objectSupport)

// For actual event query logic, put it inside the component itself. This is just an example.
const exampleEvents: { [key: string]: string[] } = {
  '2023-09-01': ['The previous month'],
  '2023-09-30': ['Example event'],
  '2023-10-11': ['Happy birthday, Z.'],
  '2023-10-14': ['Created this calendar component', 'Congrats to 400 members!'],
  '2023-10-15': ['Example event'],
  '2023-10-16': [
    'Example with a lot of events',
    'Event 2',
    'Event 3',
    'Event 4',
    'Event 5',
    'Event 6',
  ],
  '2023-10-27': ['Example meeting', 'Two meetings in 1 day'],
  '2023-11-01': ['All Saints Day'],
}

function App() {
  const [month, setMonth] = useState(dayjs())

  const calendarDays = Array.from({ length: 42 }, (_, i) => {
    const firstDayOfMonth = month.startOf('month').day()

    // Properties that might be useful. Delete whichever you don't need
    const isPreviousMonth = i < firstDayOfMonth
    const isCurrentMonth =
      i >= firstDayOfMonth && i < month.daysInMonth() + firstDayOfMonth
    const isNextMonth = !isPreviousMonth && !isCurrentMonth

    // The dayjs object returns information about the current day. You can use this to query eventsForTheDay.
    let dayjsObject
    if (isPreviousMonth) {
      dayjsObject = month.startOf('month').subtract(firstDayOfMonth - i, 'day')
    } else {
      dayjsObject = month.startOf('month').add(i - firstDayOfMonth, 'day')
    }

    const isToday = dayjsObject.isSame(dayjs(), 'day')

    // The number of the day
    const number = dayjsObject.date()

    // The eventsForTheDay for the day. Use custom logic to fetch eventsForTheDay here. Remember to return an empty array if there are no eventsForTheDay.
    const events = exampleEvents[dayjsObject.format('YYYY-MM-DD')] || []

    return {
      key: i,
      number,
      events,
      isToday,
      isPreviousMonth,
      isCurrentMonth,
      isNextMonth,
    }
  })

  const calendarWeeks = Array.from({ length: 6 }, (_, i) =>
    calendarDays.slice(i * 7, i * 7 + 7),
  )

  const actions = () => (
    <div className="grid items-center">
      <div className="col-start-1 row-start-1 flex justify-start">
        <div className="flex">
          <button
            onClick={() => setMonth(month.subtract(1, 'month'))}
            className="rounded-l-lg border px-2 py-1 hover:bg-blue-100"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
              <path d="M15 6l-6 6l6 6"></path>
            </svg>
          </button>
          <button
            onClick={() => setMonth(month.add(1, 'month'))}
            className="ml-[-1px] rounded-r-lg border px-2 py-1 hover:bg-blue-100"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
              <path d="M9 6l6 6l-6 6"></path>
            </svg>
          </button>

          <button
            onClick={() => setMonth(dayjs())}
            className="ml-4 rounded-lg border px-3 py-1 font-semibold  hover:bg-blue-100"
          >
            Today
          </button>
        </div>
      </div>
      <div className="pointer-events-none col-start-1 row-start-1 flex justify-center text-lg">
        {month.format('MMMM YYYY')}
      </div>
      <div className="pointer-events-none  col-start-1 row-start-1 flex justify-end"></div>
    </div>
  )

  const headers = () => (
    <thead className="table-header-group">
      <tr className="table-row">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <th key={day} className="table-cell border-x py-1.5 font-medium">
            {day}
          </th>
        ))}
      </tr>
    </thead>
  )

  const eventsForTheDay = (events) => {
    if (!events.length) return null

    // Limit the number of eventsForTheDay to 3. You can change this to whatever you want. Suggested 3 for UI uniformity.
    const displayLimit = 2
    if (events.length > displayLimit)
      events = [
        ...events.slice(0, displayLimit),
        `${events.length - displayLimit} more...`,
      ]

    return (
      <div className="mt-1 space-y-1 px-0.5 text-sm">
        {events.map((event, key) => (
          <div className="line-clamp-1 rounded-sm bg-blue-100 px-0.5" key={key}>
            {event}
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="p-4">
      {actions()}
      <table className="mt-3 table w-full table-fixed border-collapse flex-col border">
        {headers()}
        <tbody className="table-row-group">
          {calendarWeeks.map((day, key) => (
            <tr key={key} className="table-row">
              {day.map((day) => (
                <td key={day.number} className="table-cell border">
                  <div
                    className={
                      'flex h-28 flex-col p-0.5' +
                      (!day.isCurrentMonth ? ' bg-gray-200 opacity-25' : '')
                    }
                  >
                    <div
                      className={
                        'self-end h-7 w-7 flex items-center justify-center' +
                        (day.isToday ? ' bg-blue-300 rounded-lg' : '')
                      }
                    >
                      {day.number}
                    </div>
                    {eventsForTheDay(day.events)}
                  </div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default App
