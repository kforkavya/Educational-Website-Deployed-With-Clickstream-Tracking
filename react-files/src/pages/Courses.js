import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { getFirestore, collection, getDocs, doc, getDoc, updateDoc, arrayUnion, arrayRemove, setDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import "./Dashboard.css";

const db = getFirestore();
const auth = getAuth();

export default function Courses() {
  const [allCourses, setAllCourses] = useState([]);
  const [registeredCourses, setRegisteredCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all courses and user registration on mount
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const user = auth.currentUser;
        if (!user) {
          setAllCourses([]);
          setRegisteredCourses([]);
          setLoading(false);
          return;
        }

        // Fetch all courses
        const coursesSnapshot = await getDocs(collection(db, "courses"));
        const courses = coursesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        // Fetch user's registered courses
        const userDoc = await getDoc(doc(db, "users", user.uid));
        const registered = userDoc.exists() ? userDoc.data().registeredCourses || [] : [];

        setAllCourses(courses);
        setRegisteredCourses(registered);
      } catch (error) {
        console.error("Error loading courses:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

    async function ensureUserDocExists(userId) {
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);
    if (!userSnap.exists()) {
        await setDoc(userRef, { registeredCourses: [] });
    }
    }

    async function registerCourse(courseId) {
    const user = auth.currentUser;
    if (!user) return;

    await ensureUserDocExists(user.uid); // <-- Make sure doc exists

    const userRef = doc(db, "users", user.uid);
    await updateDoc(userRef, {
        registeredCourses: arrayUnion(courseId)
    });
    setRegisteredCourses(prev => [...prev, courseId]);
    }

    async function deregisterCourse(courseId) {
    const user = auth.currentUser;
    if (!user) return;

    await ensureUserDocExists(user.uid); // <-- Make sure doc exists

    const userRef = doc(db, "users", user.uid);
    await updateDoc(userRef, {
        registeredCourses: arrayRemove(courseId)
    });
    setRegisteredCourses(prev => prev.filter(id => id !== courseId));
    }

  if (loading) return (
    <Layout>
      <p>Loading courses...</p>
    </Layout>
  );

  return (
    <Layout>
      <h1>All Courses</h1>
      <div className="course-list">
        {allCourses.map(course => {
          const isRegistered = registeredCourses.includes(course.id);
          return (
            <div key={course.id} className="course-card">
              <h3>{course.title}</h3>
              <p>{course.description}</p>
              {isRegistered ? (
                <button onClick={() => deregisterCourse(course.id)}>Deregister</button>
              ) : (
                <button onClick={() => registerCourse(course.id)}>Register</button>
              )}
            </div>
          );
        })}
      </div>
    </Layout>
  );
}