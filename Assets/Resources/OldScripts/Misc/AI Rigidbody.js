// These variables are for adjusting in the inspector how the object behaves
var maxSpeed = 7.000;
var force = 8.000;

// Don't let the Physics Engine rotate this physics object so it doesn't fall over when running
function Awake (){
    GetComponent.<Rigidbody>().freezeRotation = true;
}

// This is called every physics frame
function FixedUpdate (){
    if(GetComponent.<Rigidbody>().velocity.magnitude < maxSpeed){
        GetComponent.<Rigidbody>().AddForce (transform.rotation * Vector3.forward);
        GetComponent.<Rigidbody>().AddForce (transform.rotation * Vector3.right);
    }
 } 