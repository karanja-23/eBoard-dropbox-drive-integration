from flask_migrate import Migrate
from flask import Flask, request, jsonify, url_for, send_file
from flask_cors import CORS
from dotenv import load_dotenv
from models import db,User,Documents,Folders
import os

load_dotenv()
app = Flask(__name__)
CORS(app)
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///data.db"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)
migrate = Migrate(app, db)

@app.route('/')
def index():
    return "Welcome to the Drive Dropbox Backend!"
@app.route('/users', methods=['GET','POST'])
def users():
    if request.method == 'POST':
        data = request.get_json()
        new_user = User(username=data['username'], email=data['email'], password=data['password'])
        db.session.add(new_user)
        db.session.commit()
        return jsonify(new_user.serialize()), 201
    else:
        users = User.query.all()
        return jsonify([user.serialize() for user in users])
@app.route('/user/<int:user_id>', methods=['GET', 'PUT', 'DELETE'])
def user_detail(user_id):
    user = User.query.get_or_404(user_id)
    if request.method == 'GET':
        return jsonify(user.serialize())
    elif request.method == 'PUT':
        data = request.get_json()
        user.username = data['username']
        user.email = data['email']
        db.session.commit()
        return jsonify(user.serialize())
    elif request.method == 'DELETE':
        db.session.delete(user)
        db.session.commit()
        return '', 204
    
@app.route('/documents', methods=['GET', 'POST'])
def get_documents():
    if request.method == 'GET':
        documents = Documents.query.all()
        return jsonify([document.to_dict() for document in documents]), 200
    if request.method == 'POST':
        name = request.form.get('name')
        document = request.files.get('document')
        type = request.form.get('type')
        user_id= int(request.form.get('user_id'))
        size = request.form.get('size')
        if request.form.get('folder_id'):
            folder_id = int(request.form.get('folder_id'))
        
        if not document:
            return jsonify({"message": "No file provided"}), 400
        document = Documents(
            name=name,
            document=document.read(),
            type=type,
            user_id=user_id,
            size=size,
            folder_id=folder_id if 'folder_id' in locals() else None
        )
        if not document.name or not document.document or not document.type:
            return jsonify({"message": "Missing required fields"}), 400    
        db.session.add(document)
        db.session.commit()
        return jsonify({"message": "Document created successfully"}), 201
@app.route('/document/<int:document_id>', methods=['GET', 'DELETE'])
def get_document(document_id):
    document = Documents.query.get_or_404(document_id)
    if request.method == 'GET':
        return jsonify(document.to_dict()), 200
    elif request.method == 'DELETE':
        db.session.delete(document)
        db.session.commit()
        return jsonify({"message": "Document deleted successfully"}), 204
@app.route('/update_dropbox_sync/<int:user_id>', methods=['PUT'])
def update_dropbox_sync(user_id):
    user = User.query.get_or_404(user_id)
    user.dropbox_sync = not user.dropbox_sync
    db.session.commit()
    return jsonify({"message": "Dropbox sync updated successfully"}), 200
@app.route('/update_drive_sync/<int:user_id>', methods=['PUT'])
def update_drive_sync(user_id):
    user = User.query.get_or_404(user_id)
    user.drive_sync = not user.drive_sync
    db.session.commit()
    return jsonify({"message": "Drive sync updated successfully"}), 200

@app.route('/folders', methods=['GET', 'POST'])
def get_folders():
    if request.method == 'GET':
        folders = Folders.query.all()
        return jsonify([folder.to_dict() for folder in folders]), 200
    if request.method == 'POST':
        name = request.form.get('name')
        description = request.form.get('description')
        user_id = int(request.form.get('user_id'))
        if not name or not user_id:
            return jsonify({"message": "Missing required fields"}), 400
        folder = Folders(name=name, user_id=user_id, description=description)
        db.session.add(folder)
        db.session.commit()
        return jsonify({"message": "Folder created successfully"}), 201
@app.route('/folder/<int:folder_id>', methods=['GET', 'PUT', 'DELETE'])
def get_folder(folder_id):
    folder = Folders.query.get_or_404(folder_id)
    if request.method == 'GET':
        return jsonify(folder.to_dict()), 200
    elif request.method == 'PUT':
        data = request.get_json()
        folder.name = data['name']
        db.session.commit()
        return jsonify(folder.to_dict()), 200
    elif request.method == 'DELETE':
        db.session.delete(folder)
        db.session.commit()
        return jsonify({"message": "Folder deleted successfully"}), 204
if __name__ == '__main__':
    app.run(debug=True,port=5050)