````markdown
# 🚀 Deploying `name_service.service` with systemd (Debian/Ubuntu)

Sigue estos pasos para registrar, habilitar y monitorear tu servicio `name_service`:

---

## 📁 1. Copiar el archivo del servicio o crear el servicio

```bash
sudo cp name_service.service /etc/systemd/system/
````

```bash
sudo nano /etc/systemd/system/name_service.service
-````

---

## 🔄 2. Recargar systemd

```bash
sudo systemctl daemon-reload
```

---

## ✅ 3. Habilitar el servicio al inicio del sistema

```bash
sudo systemctl enable name_service.service
```

---

## ▶️ 4. Iniciar el servicio manualmente

```bash
sudo systemctl start name_service.service
```

---

## 🔍 5. Verificar el estado del servicio

```bash
sudo systemctl status name_service.service
```

---

## 📋 6. Ver logs del servicio

* Ver logs completos:

```bash
sudo journalctl -u name_service.service
```

* Ver logs en tiempo real:

```bash
sudo journalctl -u name_service.service -f
```