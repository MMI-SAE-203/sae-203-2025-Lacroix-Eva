import PocketBase from 'pocketbase' ;
const pb = new PocketBase('http://127.0.0.1:8090') ;

// 1) Retourne la liste de tous les films triés par date de projection

export async function getAllMoviesSortedByDate() {
    let records = await pb.collection('Film').getFullList({sort: 'date' });
    records = records.map((film) => {
            film.img = pb.files.getURL(film, film.affiche);
            return film;
        });
    return records;
}


// 2) Retourne la liste des activités (Ateliers, expositions, animations…) triés par date de projection

export async function getAllActivitesSortedByDate() {
    const records = await pb.collection('Activite').getFullList({
        sort: 'date',
    });
    return records;
}


// 3) Retourne la liste de tous les acteurs / réalisateurs participant au festival triés par ordre alphabétique

export async function getAllActeursAndRealisateursSortedByNom() {
    const records = await pb.collection('Invite').getFullList({sort: 'nom'}, 
        {filter: "role = 'Réalisateur'||role = 'Acteur'"});
    return records;
}

// En Plus) Retourne la liste de tous les invités (animateurs, acteurs, réalisateurs) triés par ordre alphabétique

export async function getAllInvitesSortedByNom() {
    const records = await pb.collection('Invite').getFullList({sort: 'nom'});
    return records;
}

// 4) Retourne les infos d'un film en donnant son id en paramètre

export async function getFilmById(id) {
    const records = await pb.collection('Film').getOne(id, {expand: 'invite'});
    return records;
}


// 5) Retourne les infos d'une activité en donnant son id en paramètre

export async function getActivitesById(id) {
    const records = await pb.collection('Activite').getOne(id, {expand: 'invite'});
    return records;
}


// 6) Retourne les infos d'un acteur / réalisateur en donnant son id en paramètre

export async function getInviteById(id) {
    const records = await pb.collection('Invite').getOne(id);
    if (records.role === 'Animateur') {
        return "Cet invité est un animateur";
    }
    return records;
}

// En Plus) Retourne les infos d'un invité en donnant sont id en paramètre

export async function getInviteBisById(id) {
    const records = await pb.collection('Invite').getOne(id);
    return records;
}


// 7) Retourne toutes les activités d’un animateur donné par son id

export async function getActiviteByAnimateurId(id) {
    const records = await pb.collection('Activite').getFullList(
        {filter: `invite.id ='${id}'`, expand: 'Invite'});
    return records;
}

// En Plus) Retourne tous les films d’un animateur donné par son id

export async function getFilmByAnimateurId(id) {
    const records = await pb.collection('Film').getFullList(
        {filter: `invite.id ='${id}'`, expand: 'Invite'});
    return records;
}


// 8) Retourne toutes les activités d’un animateur donné par son nom
export async function getActiviteByAnimateurName(nom) {
    const records = await pb.collection('Activite').getFullList({
        filter: `invite.nom ='${nom}'`, expand: 'Invite'
    });
    return records;
}


// 9) Permet d’ajouter ou modifier les informations d’un film, activité ou invité


export async function addNewFilm(newFilm) {
    try {
        await pb.collection('Film').create(newFilm);
        return {
            success: true,
            message: 'Film ajoutée avec succès'
        };
    } catch (error) {
        console.log('Une erreur est survenue en ajoutant le film', error);
        return {
            success: false,
            message: 'Une erreur est survenue en ajoutant le film'
        };
    }
}

export async function addNewActivite(newActivite) {
    try {
        console.log(newActivite);
        
        await pb.collection('Activite').create(newActivite);
        return {
            success: true,
            message: 'Activité ajoutée avec succès'
        };
    } catch (error) {
        console.log("Une erreur est survenue en ajoutant l'activité", error);
        return {
            success: false,
            message: "Une erreur est survenue en ajoutant l'activité"
        };
    }
}

export async function addNewInvite(newInvite) {
    try {
        console.log(newInvite);
        
        await pb.collection('Invite').create(newInvite);
        return {
            success: true,
            message: 'Invité ajoutée avec succès'
        };
    } catch (error) {
        console.log("Une erreur est survenue en ajoutant l'invité", error);
        return {
            success: false,
            message: "Une erreur est survenue en ajoutant l'invité"
        };
    }
}

export async function updateFilmById(id, newFilm) {
    const records = await pb.collection("Film").update(id, newFilm) ;
    return records ;
}

export async function updateActiviteById(id, newActivite) {
    const records = await pb.collection("Activite").update(id, newActivite) ;
    return records ;
}

export async function updateInviteById(id, newInvite) {
    const records = await pb.collection("Invite").update(id, newInvite) ;
    return records ;
}

// Exportation de l'instance PocketBase pour l'utiliser dans d'autres fichiers
export { pb };

// En Plus) Filtre films par genre
export async function getOffresByGenre(g) {
    const FilmGenre = await pb.collection('Film').getFullList({
        filter: `genre = "${g}"`, // Ajout des guillemets pour éviter une erreur
    });

    FilmGenre.forEach((film) => {
        film.img = pb.files.getURL(film, film.images);
    });

    return FilmGenre;
}
