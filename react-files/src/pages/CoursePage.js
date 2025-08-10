import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getFirestore, doc, getDoc, collection, getDocs, updateDoc, arrayUnion } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import Layout from "../components/Layout";
import TextContent from "../components/TextContent";
import VideoPlayer from "../components/VideoPlayer";
import QuizComponent from "../components/QuizComponent";

const db = getFirestore();
const auth = getAuth();

export default function CoursePage() {
  const { id: courseId } = useParams();
  const [loading, setLoading] = useState(true);
  const [isRegistered, setIsRegistered] = useState(false);
  const [courseData, setCourseData] = useState(null);
  const [contents, setContents] = useState([]);
  const [error, setError] = useState(null);

  const user = auth.currentUser;

  useEffect(() => {
    if (!courseId) {
      setError("No course ID provided.");
      setLoading(false);
      return;
    }
    if (!user) {
      setError("Please login to access courses.");
      setLoading(false);
      return;
    }

    async function fetchData() {
      try {
        // Check user registration
        const userDoc = await getDoc(doc(db, "users", user.uid));
        const registeredCourses = userDoc.exists()
          ? userDoc.data().registeredCourses || []
          : [];
        const registered = registeredCourses.includes(courseId);
        setIsRegistered(registered);

        // Fetch course
        const courseDoc = await getDoc(doc(db, "courses", courseId));
        if (!courseDoc.exists()) {
          setError("Course not found.");
          setLoading(false);
          return;
        }
        setCourseData(courseDoc.data());

        // Fetch contents if registered
        if (registered) {
          const contentsSnapshot = await getDocs(
            collection(db, "courses", courseId, "contents")
          );
          const contentsArr = contentsSnapshot.docs
            .map(doc => ({ id: doc.id, ...doc.data() }))
            .sort((a, b) => (a.order || 0) - (b.order || 0));
          setContents(contentsArr);
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load course data.");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [courseId, user]);

  async function registerForCourse() {
    try {
      await updateDoc(doc(db, "users", user.uid), {
        registeredCourses: arrayUnion(courseId)
      });
      setIsRegistered(true);
    } catch (err) {
      console.error(err);
      setError("Registration failed.");
    }
  }

  if (loading)
    return (
      <Layout>
        <p>Loading...</p>
      </Layout>
    );
  if (error)
    return (
      <Layout>
        <p style={{ color: "red" }}>{error}</p>
      </Layout>
    );

  return (
    <Layout>
      <h1>{courseData?.title}</h1>
      <p>{courseData?.description}</p>

      {isRegistered ? (
        contents.length > 0 ? (
          contents.map((content, index) => {
            const moduleTitle = `Module ${index + 1}: ${content.data?.title || ""}`;
            const commonProps = {
              data: content.data,
              courseId,
              contentId: content.id,
              userId: user.uid
            };

            return (
              <div
                key={content.id}
                style={{
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                  padding: "1rem",
                  marginBottom: "1rem",
                  backgroundColor: "#f9f9f9"
                }}
              >
                <h3 style={{ marginBottom: "0.5rem" }}>{moduleTitle}</h3>

                {content.type === "text" && <TextContent {...commonProps} />}
                {content.type === "video" && <VideoPlayer {...commonProps} />}
                {content.type === "quiz" && <QuizComponent {...commonProps} />}
              </div>
            );
          })
        ) : (
          <p>No content yet.</p>
        )
      ) : (
        <>
          <p>You are not registered for this course.</p>
          <button onClick={registerForCourse}>Register Now</button>
        </>
      )}
    </Layout>
  );
}