from pyramid.view import view_config
from pyramid.response import Response
from pyramid.httpexceptions import HTTPBadGateway, HTTPBadRequest
from urlparse import urlparse
import bs4 as BeautifulSoup


import logging
import urllib2


log = logging.getLogger(__name__)


class Wms(object):

    def __init__(self, request):
        self.request = request
        self.proxyiframe = self.request.route_url('proxyiframe')

    @view_config(route_name='proxyiframe')
    def internal_proxy_wms(self):
        url = self.request.params.get('url', '')
        if len(url) == 0:
            return HTTPBadRequest()
        parsed_url = urlparse(url)
        if parsed_url.scheme != 'http':
            return HTTPBadRequest()
        timeout = 15
        try:
            f = urllib2.urlopen(url, None, timeout)
            data = f.read()
        except Exception as e:
            log.exception(e)
            log.error(url)
            return HTTPBadGateway()
        self.proxyiframe
        content_type = f.info()['Content-Type']
        headers = {"Content-Type": content_type}
        if 'html' in content_type:
            soup = BeautifulSoup.BeautifulSoup(data, "lxml")
            for i in range(len(soup(src=True))):
                src = soup(src=True)[i]['src']
                if src is not None and (src.startswith('//') or
                   src.startswith('http')):
                    soup(src=True)[i]['src'] =\
                        self.proxyiframe + '?url=' + urllib2.quote(src)
                if src is not None and (src.startswith('/')):
                    soup(src=True)[i]['src'] =\
                        self.proxyiframe + '?url=' +\
                        urllib2.quote(parsed_url.scheme +
                                      "://" + parsed_url.netloc + src)
            data = str(soup)
        return Response(data, headers=headers)
