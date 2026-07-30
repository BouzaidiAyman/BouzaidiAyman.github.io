export function AboutPage() {
  return (
    <div style={{ opacity: 0, animation: 'fadeIn 0.6s ease forwards' }}>
      <div style={{
        textAlign: 'center',
        padding: '3rem 0',
        background: 'linear-gradient(135deg, #5c4020 0%, #2a1d13 100%)',
        position: 'relative',
        overflow: 'hidden',
        marginBottom: '3rem',
      }}>
        <div style={{
          position: 'absolute', top: 0, left: '-100%', width: '100%', height: '100%',
          background: 'linear-gradient(90deg, transparent, rgba(201,163,90,0.2), transparent)',
          animation: 'shimmer 3s infinite',
        }} />
        <h1 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: 'clamp(2rem, 5vw, 3.5rem)',
          marginBottom: '1rem',
          background: 'linear-gradient(135deg, #fff 0%, #c9a35a 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          position: 'relative',
        }}>About Us</h1>
        <p style={{ fontSize: '1.3rem', color: 'rgba(255,255,255,0.9)', position: 'relative' }}>
          Who we are, and why we built this
        </p>
      </div>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 2rem 5rem', color: 'rgba(255,255,255,0.85)' }}>
        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.8rem', color: '#c9a35a', marginBottom: '1rem' }}>
            The Cultural Club
          </h2>
          <p style={{ fontSize: '1.15rem', lineHeight: 1.8, marginBottom: '1rem' }}>
            The Cultural Club is a university community built around a simple idea: the best books, movies, and
            series are worth discovering together. We bring together students who love reading, watching, and
            talking about stories — whether that's a century-old novel, a cult classic film, or the series
            everyone's been binge-watching this semester.
          </p>
          <p style={{ fontSize: '1.15rem', lineHeight: 1.8 }}>
            Beyond the site, the club runs regular meetups, discussions, and cultural events on campus where
            members can share recommendations, debate their favorite endings, and meet people who love the same
            stories they do.
          </p>
        </section>

        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.8rem', color: '#c9a35a', marginBottom: '1rem' }}>
            About This Project
          </h2>
          <p style={{ fontSize: '1.15rem', lineHeight: 1.8, marginBottom: '1rem' }}>
            This website is our shared library and community hub. It holds a curated collection of books, movies,
            and series that members can browse, rate, and discuss. Every title in the library has been picked or
            suggested by the community itself.
          </p>
          <p style={{ fontSize: '1.15rem', lineHeight: 1.8 }}>
            Members can create an account to rate titles, leave comments, and build their own reading and watching
            history. Inside the library, our assistant can also recommend something from the collection, or pass
            along a bug report, a missing-title request, or a suggestion straight to the team.
          </p>
        </section>

        <section>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.8rem', color: '#c9a35a', marginBottom: '1rem' }}>
            Get Involved
          </h2>
          <p style={{ fontSize: '1.15rem', lineHeight: 1.8 }}>
            Whether you're a casual reader or a die-hard cinephile, there's a place for you here. Create an
            account, explore the library, and let us know what we're missing — we're always looking to grow the
            collection with the community's help.
          </p>
        </section>
      </div>
    </div>
  );
}
