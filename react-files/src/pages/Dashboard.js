import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { getFirestore, collection, getDocs, doc, getDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import "./Dashboard.css";

const db = getFirestore();
const auth = getAuth();

export default function Dashboard() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUserCourses() {
      setLoading(true);
      try {
        const user = auth.currentUser;
        if (!user) {
          setCourses([]);
          setLoading(false);
          return;
        }

        // Fetch all courses from "courses" collection
        const coursesSnapshot = await getDocs(collection(db, "courses"));
        const allCourses = coursesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        // Fetch user's registeredCourses array from "users" collection
        const userDoc = await getDoc(doc(db, "users", user.uid));
        const registeredCourseIds = userDoc.exists() ? userDoc.data().registeredCourses || [] : [];

        // Filter courses to only those registered by user
        const userCourses = allCourses.filter(course => registeredCourseIds.includes(course.id));

        setCourses(userCourses);
      } catch (error) {
        console.error("Error loading courses:", error);
        setCourses([]);
      } finally {
        setLoading(false);
      }
    }

    fetchUserCourses();
  }, []);

  if (loading) return (
    <Layout>
      <p>Loading your courses...</p>
    </Layout>
  );

  if (courses.length === 0) return (
    <Layout>
      <h1>Your Courses</h1>
      <p>You are not registered for any courses yet.</p>
    </Layout>
  );

  return (
    <Layout>
      <h1>Your Courses</h1>
      <div className="course-list">
        {courses.map(course => (
          <div key={course.id} className="course-card">
            <h3>{course.title}</h3>
            <p>{course.description}</p>
            <button>View Course</button>
          </div>
        ))}
      </div>
    </Layout>
  );
}