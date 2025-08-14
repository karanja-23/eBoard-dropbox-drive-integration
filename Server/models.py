from flask_sqlalchemy import SQLAlchemy
from sqlalchemy_serializer import SerializerMixin
db = SQLAlchemy()
import base64
from datetime import datetime

class User(db.Model, SerializerMixin):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)
    documents = db.relationship('Documents', backref='user', lazy=True)
    dropbox_sync = db.Column(db.Boolean, default=False, nullable=False)
    drive_sync = db.Column(db.Boolean, default=False, nullable=False)
    folders = db.relationship('Folders', backref='user', lazy=True)
    def serialize(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'password': self.password,
            'documents': [doc.to_dict() for doc in self.documents],
            'dropbox_sync': self.dropbox_sync,
            'drive_sync': self.drive_sync,
            'folders': [folder.to_dict() for folder in self.folders],
        }

class Folders(db.Model, SerializerMixin):
    __tablename__ = 'folders'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    date_created = db.Column(db.DateTime, unique=False, nullable=False, default=datetime.utcnow)
    documents = db.relationship('Documents', backref='folder', lazy=True)
    description = db.Column(db.String(255), nullable=True)
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'user_id': self.user_id,
            'date_created': self.date_created.isoformat(),
            'documents': [doc.to_dict() for doc in self.documents],
            'description': self.description
        }
    
    def __repr__(self):
        return f'<Folder {self.name}>'
        
class Documents(db.Model, SerializerMixin):
    __tablename__ = 'documents'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    document = db.Column(db.LargeBinary, nullable=False)
    type = db.Column(db.String(255), nullable=False)
    date_created = db.Column(db.DateTime, unique=False, nullable=False, default=datetime.utcnow)
    size = db.Column(db.Integer, nullable=False)
    folder_id = db.Column(db.Integer, db.ForeignKey('folders.id'), nullable=True)
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'user_id': self.user_id,
            'document': base64.b64encode(self.document).decode('utf-8'),
            'type': self.type,
            'date_created': self.date_created.isoformat(),
            'size': self.size,
            'folder_id': self.folder_id
            
        }
    def __repr__(self):
        return f'<User {self.username}>'