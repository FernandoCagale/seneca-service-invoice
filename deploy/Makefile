deploy: stop delete pull run

stop:
		docker stop invoice || echo "Stop INVOICE"

delete:
		docker rm invoice || echo "Delete INVOICE"

pull:
		docker pull registry.gitlab.com/fernandocagale/seneca-service-invoice:latest

run:
		docker run -d \
				--net=host \
				--name invoice \
				--restart always \
				registry.gitlab.com/fernandocagale/seneca-service-invoice:latest
