import Link from 'next/link';
import EventItem from '@/components/EventItem';
import Layout from '@/components/Layout';
import { API_URL, PER_PAGE } from '@/config/index';
import Pagination from '@/components/Pagination';

export async function getServerSideProps({ query: { page = 1 } }) {
  // Calculate start page
  const start = +page === 1 ? 0 : (+page - 1) * PER_PAGE;

  // Fetch total/count
  const totalRes = await fetch(`${API_URL}/events/count`);
  const total = await totalRes.json();

  // Fetch events
  const eventRes = await fetch(
    `${API_URL}/events?_sort=date:ASC&_limit=${PER_PAGE}&_start=${start}`
  );
  const events = await eventRes.json();

  return {
    props: { events, page: +page, total },
  };
}

// export async function getStaticProps() {
//   const res = await fetch(`${API_URL}/api/events`);
//   const events = await res.json();

//   return {
//     props: { events: events.slice(0, 3) },
//     revalidate: 1,
//   };
// }

// export const getStaticProps = async () => {
//   const res = await fetch(`${API_URL}/events?_sort=date:ASC`);
//   const events = await res.json();

//   return {
//     props: { events },
//     revalidate: 1,
//   };
// };

export default function EventsPage({ events, page, total }) {
  const lastPage = Math.ceil(total / PER_PAGE);

  return (
    <Layout>
      <h1>Upcoming Events</h1>
      {events.length === 0 && (
        <>
          <h3>No events to show</h3>
          <Link href="/events">Go Back</Link>
        </>
      )}
      {events.map((evt) => (
        <EventItem key={evt.id} evt={evt} />
      ))}

      <Pagination page={page} lastPage={lastPage} />
    </Layout>
  );
}
