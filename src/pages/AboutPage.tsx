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
     
      </div>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 2rem 5rem', color: 'rgba(255,255,255,0.85)' }}>
        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.8rem', color: '#c9a35a', marginBottom: '1rem' }}>
            CLUB CULTUREL :
          </h2>
          <p style={{ fontSize: '1.15rem', lineHeight: 1.8, marginBottom: '1rem' }}>
           Sous le slogan: "فكر مبدع وقيم أصيلة" Le Club Culturel est une communauté universitaire née d’une idée simple : les meilleurs livres, films et séries méritent d’être découverts ensemble. Nous réunissons des étudiants qui aiment lire, regarder et parler d’histoires, qu’il s’agisse d’un roman centenaire, d’un film culte ou de la série que tout le monde dévore ce semestre. </p>
          <p style={{ fontSize: '1.15rem', lineHeight: 1.8 }}>
           Au-delà du site, le club organise régulièrement des rencontres, des discussions et des événements culturels sur le campus, où les membres peuvent partager leurs recommandations, débattre de leurs fins préférées et rencontrer des personnes qui aiment les mêmes histoires qu’eux.<br /> Parmi ses temps forts :<br /> les ENSAM Talk-X (une compétition d’éloquence en plusieurs langues).<br />La journée culturelle (expositions, performances artistiques et dégustations culinaires).<br />La compétition de récitation du Coran et des conférences avec des experts, comme sur l’économie islamique.Le club s'appuie sur cinq cellules complémentaires :<br />
La Cellule Projet organise des événements entre clubs autour de questions culturelles et crée les projets du club, comme ce site.<br />
La Cellule Formation forme les étudiants sur les cours et d'autres sujets utiles à leur parcours. Elle accompagne aussi les étudiants étrangers avec des formations en darija pour mieux les intégrer.<br />
La Cellule Média est responsable de la médiatisation des événements. Elle réalise les photos et les vidéos, conçoit les affiches et gère la communication du club sur les réseaux sociaux, pour faire connaître chaque activité et en garder une trace.<br />
La Cellule Organisation s'occupe de la logistique des événements : préparation des salles, décoration, installation du matériel, accueil des invités et bon déroulement de chaque journée.<br />
La Cellule Contact et Sponsoring gère les relations extérieures. Elle prend contact avec les clubs des autres écoles pour créer des partenariats, et recherche des sponsors pour soutenir financièrement et matériellement les événements du club.
          </p>
        </section>

        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.8rem', color: '#c9a35a', marginBottom: '1rem' }}>
           À PROPOS DE CE PROJECT :
          </h2>
          <p style={{ fontSize: '1.15rem', lineHeight: 1.8, marginBottom: '1rem' }}>
            Ce site est notre bibliothèque partagée et le cœur de notre communauté. Il rassemble une collection choisie de livres, de films et de séries que les membres peuvent parcourir, noter et commenter. Chaque titre de la bibliothèque a été choisi ou proposé par la communauté elle-même.

 </p>
          <p style={{ fontSize: '1.15rem', lineHeight: 1.8 }}>
           
La bibliothèque du club existe aussi en vrai : les étudiants peuvent y prendre des livres et les lire à leur rythme. Ensuite, nous nous retrouvons pour en discuter lors de tables rondes, où chacun partage son avis, ses coups de cœur et ses désaccords sur ce qu’il a lu. Côté formation, la Cellule Formation propose aux étudiants des formations sur les cours et d’autres sujets utiles à leur parcours. Elle accompagne aussi les étudiants étrangers, avec des formations en darija, pour qu’ils s’intègrent plus facilement.
          </p>
        </section>

        <section>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.8rem', color: '#c9a35a', marginBottom: '1rem' }}>
           REJOIGNEZ-NOUS :
          </h2>
          <p style={{ fontSize: '1.15rem', lineHeight: 1.8 }}>
           Que vous soyez un lecteur occasionnel ou un cinéphile passionné, il y a une place pour vous ici. Créez un compte, explorez la bibliothèque et dites-nous ce qui manque — nous cherchons toujours à agrandir la collection avec l'aide de la communauté.
          </p>
        </section>
      </div>
    </div>
  );
}
