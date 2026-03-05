import { useState, useEffect } from 'react';
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';

export function useAnimals() {
    const [animals, setAnimals] = useState([]);

    useEffect(() => {
        const q = collection(db, 'animals');
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const animalsData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setAnimals(animalsData);
        }, (error) => {
            console.error("Firestore onSnapshot Error:", error);
            alert("Fehler beim Laden der Tierdaten. Prüfe die Firestore-Sicherheitsregeln: " + error.message);
        });

        return unsubscribe;
    }, []);
    const addAnimal = async (animalData) => {
        try {
            const newAnimal = {
                ...animalData,
                createdAt: new Date().toISOString()
            };
            await addDoc(collection(db, 'animals'), newAnimal);
        } catch (error) {
            console.error("Error adding animal: ", error);
            alert("Tier konnte nicht gespeichert werden: " + error.message);
        }
    };

    const updateAnimal = async (id, updates) => {
        try {
            const animalRef = doc(db, 'animals', id);
            await updateDoc(animalRef, {
                ...updates,
                updatedAt: new Date().toISOString()
            });
        } catch (error) {
            console.error("Error updating animal: ", error);
            alert("Status konnte nicht geändert werden: " + error.message);
        }
    };

    const deleteAnimal = async (id) => {
        try {
            await deleteDoc(doc(db, 'animals', id));
        } catch (error) {
            console.error("Error deleting animal: ", error);
            alert("Tier konnte nicht gelöscht werden: " + error.message);
        }
    };

    return { animals, addAnimal, updateAnimal, deleteAnimal };
}
