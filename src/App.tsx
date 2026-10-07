import { useEffect, useState } from 'react';
import { Link, Route, Routes, useParams } from 'react-router-dom';
import {
  Heart,
  Search,
  SlidersHorizontal,
  ArrowRight,
  X,
  Check,
  CarFront,
  GitCompare,
  Menu,
} from 'lucide-react';
import { cars } from './data';
import { Car } from './types';
const money = (n: number) => `€${n.toLocaleString()}`;
function useStored<T>(key: string, initial: T) {
  const [v, setV] = useState<T>(() => {
    try {
      return JSON.parse(localStorage.getItem(key) || 'null') ?? initial;
    } catch {
      return initial;
    }
  });
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(v));
  }, [key, v]);
  return [v, setV] as const;
}
function App() {
  const [compare, setCompare] = useStored<number[]>('ac-compare', []);
  const [favorites, setFavorites] = useStored<number[]>('ac-favorites', []);
  const [toast, setToast] = useState('');
  const add = (id: number) => {
    if (compare.includes(id)) return;
    if (compare.length >= 3) {
      setToast('You can compare up to 3 cars');
      return;
    }
    setCompare([...compare, id]);
    const car = cars.find((c) => c.id === id);
    setToast(`${car?.brand} ${car?.model} added to comparison`);
  };
  const remove = (id: number) => {
    setCompare(compare.filter((x) => x !== id));
  };
  const fav = (id: number) => {
    setFavorites(favorites.includes(id) ? favorites.filter((x) => x !== id) : [...favorites, id]);
  };
  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(''), 2200);
      return () => clearTimeout(t);
    }
  }, [toast]);
  return (
    <>
      {' '}
      <Nav favorites={favorites.length} />{' '}
      <Routes>
        {' '}
        <Route path="/" element={<Home />} />{' '}
        <Route
          path="/cars"
          element={<CarsPage compare={compare} add={add} favorites={favorites} fav={fav} />}
        />{' '}
        <Route
          path="/cars/:id"
          element={<Details add={add} compare={compare} favorites={favorites} fav={fav} />}
        />{' '}
        <Route path="/compare" element={<Compare ids={compare} remove={remove} />} />{' '}
        <Route
          path="/favorites"
          element={<Favorites ids={favorites} fav={fav} add={add} compare={compare} />}
        />{' '}
      </Routes>{' '}
      <CompareBar ids={compare} remove={remove} />{' '}
      {toast && <div className="toast">{toast}</div>}{' '}
    </>
  );
}
function Nav({ favorites }: { favorites: number }) {
  const [open, setOpen] = useState(false);
  return (
    <nav>
      {' '}
      <Link to="/" className="logo">
        {' '}
        <span>AC</span> AutoCompare{' '}
      </Link>{' '}
      <button className="menu" onClick={() => setOpen(!open)}>
        {' '}
        <Menu />{' '}
      </button>{' '}
      <div className={open ? 'navlinks open' : 'navlinks'}>
        {' '}
        <Link to="/cars">Explore cars</Link>{' '}
        <Link to="/favorites"> Favorites {favorites > 0 && <b>{favorites}</b>} </Link>{' '}
        <Link to="/compare">Compare</Link>{' '}
      </div>{' '}
    </nav>
  );
}
function Home() {
  return (
    <>
      {' '}
      <section className="hero">
        {' '}
        <div className="heroCopy">
          {' '}
          <p className="eyebrow">THE SMARTER WAY TO SHOP</p>{' '}
          <h1>
            {' '}
            Compare cars. <br /> <em>Find the right one.</em>{' '}
          </h1>{' '}
          <p className="lead">
            {' '}
            Explore specs, prices and real-world details side by side. Make your next car decision
            with confidence.{' '}
          </p>{' '}
          <Link className="btn primary" to="/cars">
            {' '}
            Explore cars <ArrowRight size={18} />{' '}
          </Link>{' '}
        </div>{' '}
        <img src={cars[2].image} alt="Premium Audi car" />{' '}
      </section>{' '}
      <section className="section">
        {' '}
        <div className="sectionHead">
          {' '}
          <div>
            {' '}
            <p className="eyebrow">CURATED FOR YOU</p> <h2>Featured cars</h2>{' '}
          </div>{' '}
          <Link to="/cars" className="textLink">
            {' '}
            View all <ArrowRight size={16} />{' '}
          </Link>{' '}
        </div>{' '}
        <div className="grid">
          {' '}
          {cars.slice(0, 4).map((c) => (
            <CarCard
              key={c.id}
              car={c}
              favorite={false}
              onFav={() => {}}
              onCompare={() => {}}
              selected={false}
            />
          ))}{' '}
        </div>{' '}
      </section>{' '}
      <section className="brands">
        {' '}
        <p className="eyebrow">POPULAR MANUFACTURERS</p>{' '}
        <div>
          {' '}
          {['Volvo', 'BMW', 'Audi', 'Mercedes-Benz', 'Tesla', 'Porsche'].map((x) => (
            <span key={x}>{x}</span>
          ))}{' '}
        </div>{' '}
      </section>{' '}
      <section className="how section">
        {' '}
        <p className="eyebrow">SIMPLE BY DESIGN</p> <h2>From shortlist to decision.</h2>{' '}
        <div className="steps">
          {' '}
          {[
            ['01', 'Browse', 'Find cars that match your needs.'],
            ['02', 'Compare', 'Put up to three cars side by side.'],
            ['03', 'Decide', 'See what actually matters at a glance.'],
          ].map((s) => (
            <div key={s[0]}>
              {' '}
              <strong>{s[0]}</strong> <h3>{s[1]}</h3> <p>{s[2]}</p>{' '}
            </div>
          ))}{' '}
        </div>{' '}
      </section>{' '}
      <Footer />{' '}
    </>
  );
}
function CarCard({
  car,
  favorite,
  onFav,
  onCompare,
  selected,
}: {
  car: Car;
  favorite: boolean;
  onFav: () => void;
  onCompare: () => void;
  selected: boolean;
}) {
  return (
    <article className="card">
      {' '}
      <div className="imageWrap">
        {' '}
        <img src={car.image} alt={`${car.brand} ${car.model}`} />{' '}
        <button
          className={favorite ? 'heart active' : 'heart'}
          onClick={onFav}
          aria-label="Favorite"
        >
          {' '}
          <Heart size={18} fill={favorite ? 'currentColor' : 'none'} />{' '}
        </button>{' '}
        {selected && <span className="selected">Selected</span>}{' '}
      </div>{' '}
      <div className="cardBody">
        {' '}
        <div className="muted">
          {' '}
          {car.brand} · {car.year}{' '}
        </div>{' '}
        <h3>{car.model}</h3> <div className="price">{money(car.price)}</div>{' '}
        <div className="specs">
          {' '}
          <span>{car.mileage.toLocaleString()} km</span> <span>{car.fuelType}</span>{' '}
          <span>{car.horsepower} hp</span>{' '}
        </div>{' '}
        <div className="cardActions">
          {' '}
          <Link to={`/cars/${car.id}`} className="btn ghost">
            {' '}
            Details{' '}
          </Link>{' '}
          <button className="btn dark" onClick={onCompare}>
            {' '}
            {selected ? 'Added' : 'Compare'}{' '}
          </button>{' '}
        </div>{' '}
      </div>{' '}
    </article>
  );
}
function CarsPage({
  compare,
  add,
  favorites,
  fav,
}: {
  compare: number[];
  add: (id: number) => void;
  favorites: number[];
  fav: (id: number) => void;
}) {
  const [q, setQ] = useState('');
  const [brand, setBrand] = useState('All');
  const [fuel, setFuel] = useState('All');
  const [sort, setSort] = useState('Featured');
  const [filters, setFilters] = useState(false);
  const [max, setMax] = useState(130000);
  const brands = ['All', ...Array.from(new Set(cars.map((c) => c.brand)))];
  let list = cars.filter(
    (c) =>
      `${c.brand} ${c.model}`.toLowerCase().includes(q.toLowerCase()) &&
      (brand === 'All' || c.brand === brand) &&
      (fuel === 'All' || c.fuelType === fuel) &&
      c.price <= max,
  );
  list = [...list].sort((a, b) =>
    sort === 'Price low'
      ? a.price - b.price
      : sort === 'Power'
        ? b.horsepower - a.horsepower
        : sort === 'Rating'
          ? b.rating - a.rating
          : 0,
  );
  return (
    <>
      {' '}
      <main className="listing">
        {' '}
        <div className="listingTop">
          {' '}
          <div>
            {' '}
            <p className="eyebrow">EXPLORE</p> <h1>Find your next car.</h1>{' '}
            <p className="lead small">
              {' '}
              Compare the details that matter before you make a decision.{' '}
            </p>{' '}
          </div>{' '}
          <button className="filterToggle" onClick={() => setFilters(!filters)}>
            {' '}
            <SlidersHorizontal /> Filters{' '}
          </button>{' '}
        </div>{' '}
        <div className="searchbox">
          {' '}
          <Search />{' '}
          <input
            placeholder="Search brand or model..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />{' '}
        </div>{' '}
        <div className="catalog">
          {' '}
          <aside className={filters ? 'filters mobileOpen' : 'filters'}>
            {' '}
            <div className="filterTitle">
              {' '}
              <b>Filters</b>{' '}
              <button
                onClick={() => {
                  setBrand('All');
                  setFuel('All');
                  setMax(130000);
                }}
              >
                {' '}
                Clear{' '}
              </button>{' '}
            </div>{' '}
            <label>
              {' '}
              Brand{' '}
              <select value={brand} onChange={(e) => setBrand(e.target.value)}>
                {' '}
                {brands.map((x) => (
                  <option key={x}>{x}</option>
                ))}{' '}
              </select>{' '}
            </label>{' '}
            <label>
              {' '}
              Fuel type{' '}
              <select value={fuel} onChange={(e) => setFuel(e.target.value)}>
                {' '}
                <option>All</option> <option>Petrol</option> <option>Diesel</option>{' '}
                <option>Hybrid</option> <option>Electric</option>{' '}
              </select>{' '}
            </label>{' '}
            <label>
              {' '}
              Max price <b>{money(max)}</b>{' '}
              <input
                type="range"
                min="25000"
                max="130000"
                step="1000"
                value={max}
                onChange={(e) => setMax(+e.target.value)}
              />{' '}
            </label>{' '}
          </aside>{' '}
          <section className="results">
            {' '}
            <div className="resultsHead">
              {' '}
              <span>{list.length} cars</span>{' '}
              <select value={sort} onChange={(e) => setSort(e.target.value)}>
                {' '}
                <option>Featured</option> <option>Price low</option> <option>Power</option>{' '}
                <option>Rating</option>{' '}
              </select>{' '}
            </div>{' '}
            {list.length ? (
              <div className="grid">
                {' '}
                {list.map((c) => (
                  <CarCard
                    key={c.id}
                    car={c}
                    favorite={favorites.includes(c.id)}
                    onFav={() => fav(c.id)}
                    onCompare={() => add(c.id)}
                    selected={compare.includes(c.id)}
                  />
                ))}{' '}
              </div>
            ) : (
              <div className="empty">
                {' '}
                <CarFront /> <h3>No cars found</h3> <p>Try changing your search or filters.</p>{' '}
              </div>
            )}{' '}
          </section>{' '}
        </div>{' '}
      </main>{' '}
      <Footer />{' '}
    </>
  );
}
function Details({
  add,
  compare,
  favorites,
  fav,
}: {
  add: (id: number) => void;
  compare: number[];
  favorites: number[];
  fav: (id: number) => void;
}) {
  const { id } = useParams();
  const car = cars.find((c) => c.id === Number(id));
  if (!car) {
    return (
      <div className="empty page">
        {' '}
        <h2>Car not found</h2> <Link to="/cars">Back to cars</Link>{' '}
      </div>
    );
  }
  return (
    <main className="details">
      {' '}
      <Link to="/cars" className="back">
        {' '}
        ← Back to cars{' '}
      </Link>{' '}
      <div className="detailHero">
        {' '}
        <div className="detailImage">
          {' '}
          <img src={car.image} alt={`${car.brand} ${car.model}`} />{' '}
        </div>{' '}
        <div className="detailCopy">
          {' '}
          <p className="eyebrow">{car.brand.toUpperCase()}</p> <h1>{car.model}</h1>{' '}
          <div className="detailPrice">{money(car.price)}</div>{' '}
          <div className="pillrow">
            {' '}
            <span>{car.year}</span> <span>{car.mileage.toLocaleString()} km</span>{' '}
            <span>{car.fuelType}</span> <span>{car.horsepower} hp</span>{' '}
          </div>{' '}
          <p className="lead small">
            {' '}
            A refined everyday car balancing performance, comfort and practical technology.{' '}
          </p>{' '}
          <div className="detailButtons">
            {' '}
            <button
              className="btn primary big"
              onClick={() => add(car.id)}
              disabled={compare.includes(car.id)}
            >
              {' '}
              {compare.includes(car.id) ? 'Added to comparison' : 'Add to comparison'}{' '}
              <GitCompare size={18} />{' '}
            </button>{' '}
            <button className="iconBtn" onClick={() => fav(car.id)} aria-label="Favorite">
              {' '}
              <Heart fill={favorites.includes(car.id) ? 'currentColor' : 'none'} />{' '}
            </button>{' '}
          </div>{' '}
        </div>{' '}
      </div>{' '}
      <section className="section specsSection">
        {' '}
        <p className="eyebrow">SPECIFICATIONS</p> <h2>The numbers.</h2>{' '}
        <div className="specTable">
          {' '}
          {[
            ['Engine', '2.0L Turbo'],
            ['Horsepower', `${car.horsepower} hp`],
            ['Torque', `${car.torque} Nm`],
            ['0–100 km/h', `${car.acceleration}s`],
            ['Top speed', `${car.topSpeed} km/h`],
            [
              'Fuel consumption',
              car.fuelConsumption ? `${car.fuelConsumption} L/100km` : 'Electric',
            ],
            ['CO₂ emissions', car.co2 ? `${car.co2} g/km` : '0 g/km'],
            ['Transmission', car.transmission],
          ].map((x) => (
            <div key={x[0]}>
              {' '}
              <span>{x[0]}</span> <b>{x[1]}</b>{' '}
            </div>
          ))}{' '}
        </div>{' '}
        <h2 className="subhead">Key features</h2>{' '}
        <div className="featureList" style={{ marginTop: '20px' }}>
          {' '}
          {car.features.map((x) => (
            <span key={x}>
              {' '}
              <Check size={16} /> {x}{' '}
            </span>
          ))}{' '}
        </div>{' '}
      </section>{' '}
    </main>
  );
}
function Compare({ ids, remove }: { ids: number[]; remove: (id: number) => void }) {
  const selected = ids.map((id) => cars.find((c) => c.id === id)).filter(Boolean) as Car[];
  const rows: [string, (c: Car) => string | number][] = [
    ['Price', (c) => money(c.price)],
    ['Year', (c) => c.year],
    ['Mileage', (c) => `${c.mileage.toLocaleString()} km`],
    ['Horsepower', (c) => `${c.horsepower} hp`],
    ['0–100 km/h', (c) => `${c.acceleration}s`],
    ['Top speed', (c) => `${c.topSpeed} km/h`],
    ['Fuel consumption', (c) => (c.fuelConsumption ? `${c.fuelConsumption} L/100km` : 'Electric')],
    ['CO₂', (c) => (c.co2 ? `${c.co2} g/km` : '0 g/km')],
    ['Rating', (c) => `${c.rating}/5`],
  ];
  return (
    <main className="comparePage">
      {' '}
      <p className="eyebrow">SIDE BY SIDE</p> <h1>Compare cars.</h1>{' '}
      {selected.length < 2 ? (
        <div className="empty">
          {' '}
          <GitCompare /> <h3>Select at least two cars</h3>{' '}
          <p> Add cars from the explore page to see a detailed comparison. </p>{' '}
          <Link className="btn primary" to="/cars">
            {' '}
            Explore cars{' '}
          </Link>{' '}
        </div>
      ) : (
        <div className="compareTable">
          {' '}
          <div className="compareHead">
            {' '}
            <div>Specification</div>{' '}
            {selected.map((c) => (
              <div key={c.id}>
                {' '}
                <img src={c.image} alt="" />{' '}
                <b>
                  {' '}
                  {c.brand} {c.model}{' '}
                </b>{' '}
                <button onClick={() => remove(c.id)}>
                  {' '}
                  <X size={15} /> Remove{' '}
                </button>{' '}
              </div>
            ))}{' '}
          </div>{' '}
          {rows.map(([label, fn], i) => {
            const nums = selected.map((c) =>
              i === 0
                ? c.price
                : i === 3
                  ? c.horsepower
                  : i === 4
                    ? c.acceleration
                    : i === 5
                      ? c.topSpeed
                      : i === 6
                        ? c.fuelConsumption || 0
                        : i === 7
                          ? c.co2 || 0
                          : 0,
            );
            const best =
              i === 0 || i === 4 || i === 6 || i === 7 ? Math.min(...nums) : Math.max(...nums);
            return (
              <div className="compareRow" key={label}>
                {' '}
                <span>{label}</span>{' '}
                {selected.map((c) => (
                  <b key={c.id} className={nums[i] === best && nums[i] !== 0 ? 'best' : ''}>
                    {' '}
                    {fn(c)}{' '}
                  </b>
                ))}{' '}
              </div>
            );
          })}{' '}
        </div>
      )}{' '}
    </main>
  );
}
function Favorites({
  ids,
  fav,
  add,
  compare,
}: {
  ids: number[];
  fav: (id: number) => void;
  add: (id: number) => void;
  compare: number[];
}) {
  const list = cars.filter((c) => ids.includes(c.id));
  return (
    <main className="listing">
      {' '}
      <p className="eyebrow">YOUR SHORTLIST</p> <h1>Favorites.</h1>{' '}
      {list.length ? (
        <div className="grid">
          {' '}
          {list.map((c) => (
            <CarCard
              key={c.id}
              car={c}
              favorite
              onFav={() => fav(c.id)}
              onCompare={() => add(c.id)}
              selected={compare.includes(c.id)}
            />
          ))}{' '}
        </div>
      ) : (
        <div className="empty">
          {' '}
          <Heart /> <h3>No favorites yet</h3> <p>Save cars you like and they'll appear here.</p>{' '}
          <Link to="/cars" className="btn primary">
            {' '}
            Explore cars{' '}
          </Link>{' '}
        </div>
      )}{' '}
    </main>
  );
}
function CompareBar({ ids, remove }: { ids: number[]; remove: (id: number) => void }) {
  if (!ids.length) return null;
  return (
    <div className="compareBar">
      {' '}
      <div>
        {' '}
        <b>Compare</b>{' '}
        {ids.map((id) => {
          const c = cars.find((x) => x.id === id)!;
          return (
            <span key={id}>
              {' '}
              {c.brand} {c.model}{' '}
              <button onClick={() => remove(id)}>
                {' '}
                <X size={13} />{' '}
              </button>{' '}
            </span>
          );
        })}{' '}
      </div>{' '}
      {ids.length > 1 ? (
        <Link className="btn primary" to="/compare">
          {' '}
          Compare now <ArrowRight size={16} />{' '}
        </Link>
      ) : (
        <span className="hint">Add one more car</span>
      )}{' '}
    </div>
  );
}
function Footer() {
  return (
    <footer>
      {' '}
      <div className="logo">
        {' '}
        <span>AC</span> AutoCompare{' '}
      </div>{' '}
      <p>Make better car decisions, faster.</p> <small>© 2026 AutoCompare</small>{' '}
    </footer>
  );
}
export default App;
