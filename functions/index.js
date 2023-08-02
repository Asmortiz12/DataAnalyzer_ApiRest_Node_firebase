const functions = require ('firebase-functions');
const admin =require('firebase-admin')
const express = require ('express');

const app = express()

admin.initializeApp({
    credential:admin.credential.cert('./permissions.json'),
    databaseURL:'https://api-student-543c3-default-rtdb.firebaseio.com'
})
const db = admin.firestore()
// Ese utiliza para crear la coleccion 
app.post( '/api/students', async (req, res)=>{
  await db.collection("students")
   .doc("/"+ req.body.id +"/")
   .create({names:req.body.names, 
      surnames:req.body.surnames,
      carrer:req.body.carrer,
      semester:req.body.semester
    })
  return res.status(200).json({message:'Add successful'} );
});

app.get("/api/students/:student_id", (req, res) => {
    (async () => {
      try {
        const doc = db.collection("students").doc(req.params.student_id);
        const item = await doc.get();
        const response = item.data();
        return res.status(200).send(response);
      } catch (error) {
        return res.status(500).send(error);
      }
    })();
  });
  
  app.get("/api/students", async (req, res) => {
    try {
      let query = db.collection("students");
      const querySnapshot = await query.get();
      let docs = querySnapshot.docs;
  
      const response = docs.map((doc) => ({
        id: doc.id,
        names: doc.data().names,
        surnamesname: doc.data().surname,
        carrer: doc.data().carrer,
        semester: doc.data().semester,
      }));
  
      return res.status(200).json(response);
    } catch (error) {
      return res.status(500).json(error);
    }
  });
  
  app.put("/api/students/:student_id", async (req, res) => {
    try {
      const document = db.collection("students").doc(req.params.student_id);
      await document.update({
        names: req.body.names,
        surnames:req.body.surnames,
        carrer:req.body.carrer,
        semester:req.body.semester
      });
      return res.status(200).json({message: 'Update successful'} );
    } catch (error) {
      return res.status(500).json();
    }
  });
  
  app.delete("/api/students/:student_id", async (req, res) => {
    try {
      const doc = db.collection("students").doc(req.params.student_id);
      await doc.delete();
      return res.status(200).json({message:'Delete successful'} );
    } catch (error) {
      return res.status(500).send(error);
    }
  });
  

exports.app = functions.https.onRequest(app);


