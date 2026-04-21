export default function SearchBox({
  search,
  setSearch,
  suggestions,
  setSuggestions,
  setSearchLocation,
}) {
  const handleSearch = async (val) => {
    setSearch(val);

    if (val.length < 2) return setSuggestions([]);

    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${val}&limit=5`
    );

    const data = await res.json();
    setSuggestions(data);
  };

  const selectPlace = (p) => {
    setSearch(p.display_name);
    setSearchLocation([+p.lat, +p.lon]);
    setSuggestions([]);
  };

  return (
    <>
      <input
        value={search}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder="Yer ara"
      />

      {suggestions.map((s, i) => (
        <div key={i} onClick={() => selectPlace(s)}>
          {s.display_name}
        </div>
      ))}
    </>
  );
}