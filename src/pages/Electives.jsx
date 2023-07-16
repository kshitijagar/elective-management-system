import React, { useState, useEffect } from "react";
import { database } from "../firebaseConfig";
import {
  collection,
  getDocs,
  doc,
  addDoc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";

const Subjects = () => {
  const [subjects, setSubjects] = useState([]);
  const [newSubjectCode, setNewSubjectCode] = useState("");
  const [newSubjectName, setNewSubjectName] = useState("");
  const [newSubjectDescription, setNewSubjectDescription] = useState("");
  const [newInstructorName, setNewInstructorName] = useState("");
  const [editSubjectId, setEditSubjectId] = useState("");
  const [editSubjectCode, setEditSubjectCode] = useState("");
  const [editSubjectName, setEditSubjectName] = useState("");
  const [editSubjectDescription, setEditSubjectDescription] = useState("");
  const [editInstructorName, setEditInstructorName] = useState("");

  useEffect(() => {
    const fetchSubjects = async () => {
      const subjectsRef = collection(database, "subjects");
      const snapshot = await getDocs(subjectsRef);
      const subjectList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setSubjects(subjectList);
    };

    fetchSubjects();
  }, []);

  const addSubject = async () => {
    if (
      newSubjectCode !== "" &&
      newSubjectName !== "" &&
      newSubjectDescription !== "" &&
      newInstructorName !== ""
    ) {
      try {
        const subjectsRef = collection(database, "subjects");
        const newSubject = {
          code: newSubjectCode,
          name: newSubjectName,
          description: newSubjectDescription,
          instructorName: newInstructorName,
        };
        await addDoc(subjectsRef, newSubject);

        setNewSubjectCode("");
        setNewSubjectName("");
        setNewSubjectDescription("");
        setNewInstructorName("");
        setSubjects([...subjects, newSubject]);
      } catch (error) {
        console.error("Error adding subject:", error);
      }
    }
  };

  const deleteSubject = async (subjectId) => {
    try {
      const subjectRef = doc(database, "subjects", subjectId);
      await deleteDoc(subjectRef);

      const updatedSubjects = subjects.filter(
        (subject) => subject.id !== subjectId
      );
      setSubjects(updatedSubjects);
    } catch (error) {
      console.error("Error deleting subject:", error);
    }
  };

  const editSubject = (
    subjectId,
    subjectCode,
    subjectName,
    subjectDescription,
    instructorName
  ) => {
    setEditSubjectId(subjectId);
    setEditSubjectCode(subjectCode);
    setEditSubjectName(subjectName);
    setEditSubjectDescription(subjectDescription);
    setEditInstructorName(instructorName);
  };

  const updateSubject = async () => {
    try {
      const subjectRef = doc(database, "subjects", editSubjectId);
      await updateDoc(subjectRef, {
        code: editSubjectCode,
        name: editSubjectName,
        description: editSubjectDescription,
        instructorName: editInstructorName,
      });

      const updatedSubjects = subjects.map((subject) => {
        if (subject.id === editSubjectId) {
          return {
            ...subject,
            code: editSubjectCode,
            name: editSubjectName,
            description: editSubjectDescription,
            instructorName: editInstructorName,
          };
        }
        return subject;
      });

      setSubjects(updatedSubjects);
      setEditSubjectId("");
      setEditSubjectCode("");
      setEditSubjectName("");
      setEditSubjectDescription("");
      setEditInstructorName("");
    } catch (error) {
      console.error("Error updating subject:", error);
    }
  };

  return (
    <div className="w-full bg-neutral-800 p-12 flex flex-col">
      <div className="w-full text-center text-white ">
        <h1 className="text-7xl font-anton">Electives</h1>
      </div>
      <br></br>
      <br></br>
      <div className="md:flex">
        <div className="md:w-1/3 bg-violet-800 p-16 md:mr-2 rounded-xl">
          <div className="text-white">
            <h1 className="text-5xl">Add a Subject here</h1>
            <br></br>
            <h1 className="text-2xl">Enter subject details:</h1>
          </div>

          <br></br>
          <div>
            <h1 className="text-white">Enter subject code</h1>
            <input
              className="m-2  h-8 rounded-xl"
              type="text"
              value={newSubjectCode}
              onChange={(e) => setNewSubjectCode(e.target.value)}
              placeholder=" Enter subject code"
            />
            <br></br>
            <h1 className="text-white">Enter subject name</h1>
            <input
              className="m-2  h-8 rounded-xl"
              type="text"
              value={newSubjectName}
              onChange={(e) => setNewSubjectName(e.target.value)}
              placeholder="Enter subject name"
            />
            <br></br>
            <h1 className="text-white">Enter subject description</h1>
            <input
              className="m-2  h-8 rounded-xl"
              type="text"
              value={newSubjectDescription}
              onChange={(e) => setNewSubjectDescription(e.target.value)}
              placeholder="Enter subject description"
            />
            <br></br>
            <h1 className="text-white">Enter instructor's name</h1>
            <input
              className="m-2  h-8 rounded-xl"
              type="text"
              value={newInstructorName}
              onChange={(e) => setNewInstructorName(e.target.value)}
              placeholder="Enter instructor's name"
            />
          </div>
          <div className="text-white m-4">
            <button
              className="bg-violet-700 outline outline-violet-400 outline-4 hover:bg-pink-500 hover:outline-pink-300  p-2 rounded-3xl"
              onClick={addSubject}
            >
              Add Subject
            </button>
          </div>
        </div>
        <div className="p-16 md:w-2/3 bg-blue-700 md:ml-2 rounded-xl text-white overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="md:text-3xl text-xl">
                <th className="text-left">Code</th><th>   </th><th> </th>
                <th className="text-left">Name</th><th> </th>
                <th className="text-left">Description</th><th> </th>
                <th className="text-left">Instructor</th><th> </th>
                <th></th>
                <th></th>
              </tr>
            </thead>
            <br></br>
            <tbody>
              {subjects.map((subject) => (
                <tr key={subject.id}>
                  {subject.id === editSubjectId ? (
                    <>
                      <td>
                        <input
                          className="text-black p-2 rounded-xl"
                          type="text"
                          value={editSubjectCode}
                          onChange={(e) => setEditSubjectCode(e.target.value)}
                        />
                      </td>
                      <td>
                        <input
                          className="text-black p-2 rounded-xl"
                          type="text"
                          value={editSubjectName}
                          onChange={(e) => setEditSubjectName(e.target.value)}
                        />
                      </td>
                      <td>
                        <input
                          className="text-black p-2 rounded-xl"
                          type="text"
                          value={editSubjectDescription}
                          onChange={(e) =>
                            setEditSubjectDescription(e.target.value)
                          }
                        />
                      </td>
                      <td>
                        <input
                          className="text-black p-2 rounded-xl"
                          type="text"
                          value={editInstructorName}
                          onChange={(e) =>
                            setEditInstructorName(e.target.value)
                          }
                        />
                      </td>
                      <td>
                        <button
                          className="bg-violet-700 outline outline-violet-400 outline-2 hover:bg-pink-500 hover:outline-pink-300  rounded-3xl w-24"
                          onClick={updateSubject}
                        >
                          Save
                        </button>
                      </td>
                      <td></td>
                    </>
                  ) : (
                    <>
                      <td>{subject.code}</td><td> </td><td> </td>
                      <td>{subject.name}</td><td> </td>
                      <td>{subject.description}</td><td> </td>
                      <td>{subject.instructorName}</td>
                      <td>
                        <button
                          className="bg-violet-700 outline outline-violet-400 outline-2 hover:bg-pink-500 hover:outline-pink-300 w-12  rounded-3xl"
                          onClick={() =>
                            editSubject(
                              subject.id,
                              subject.code,
                              subject.name,
                              subject.description,
                              subject.instructorName
                            )
                          }
                        >
                          Edit
                        </button>
                      </td>
                      <td>
                        <button
                          className="bg-violet-700 outline outline-violet-400 outline-2 hover:bg-pink-500 hover:outline-pink-300 w-24 rounded-3xl"
                          onClick={() => deleteSubject(subject.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Subjects;
