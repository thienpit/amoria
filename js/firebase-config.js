var firebaseConfig = {
  apiKey: "AIzaSyCgrUDkLRCMLkMCO3k5-vOuLZAk2NpW-o8",
  authDomain: "amoria-7b0b6.firebaseapp.com",
  projectId: "amoria-7b0b6",
  storageBucket: "amoria-7b0b6.firebasestorage.app",
  messagingSenderId: "1065475072642",
  appId: "1:1065475072642:web:81dc4fc250760784b98a9b"
};
firebase.initializeApp(firebaseConfig);
var db = firebase.firestore();
var COLLECTIONS = { ORDERS: "orders", SUBSCRIPTIONS: "subscriptions", VISITS: "visits" };
console.log("Firebase OK");
function addDocument(col, data) {
  var d = Object.assign({}, data, { createdAt: firebase.firestore.FieldValue.serverTimestamp() });
  return db.collection(col).add(d).then(function(r){ console.log("Saved",col,r.id); return r.id; });
}
function getDocuments(col) {
  return db.collection(col).orderBy("createdAt","desc").get().then(function(s){
    return s.docs.map(function(doc){ return Object.assign({id:doc.id},doc.data()); });
  });
}
function deleteAllDocuments(col) {
  return db.collection(col).get().then(function(s){
    var b=db.batch(); s.docs.forEach(function(d){b.delete(d.ref);}); return b.commit();
  });
}
function trackVisit() {
  var ua=navigator.userAgent, br="Unknown";
  if(ua.indexOf("Firefox")>-1) br="Firefox";
  else if(ua.indexOf("Edge")>-1) br="Edge";
  else if(ua.indexOf("Chrome")>-1) br="Chrome";
  else if(ua.indexOf("Safari")>-1) br="Safari";
  addDocument(COLLECTIONS.VISITS,{
    timestamp: new Date().toLocaleString("vi-VN"),
    device: /iPhone|iPad|iPod|Android/.test(ua)?"Di dong":"May tinh",
    browser: br, screen: window.innerWidth+"x"+window.innerHeight,
    referrer: document.referrer||"Truc tiep"
  }).catch(function(e){console.warn("trackVisit:",e.message);});
}
